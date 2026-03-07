import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Loader2,
  Radar,
  RefreshCw,
  Server,
  Shield,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getAssets } from '../../services/assetsService';
import { getScans } from '../../services/scanService';
import type { AssetStatus } from '../../types/assets';
import { loadAppSettings } from '../../utils/appSettings';

type ScanStatusCount = {
  completed: number;
  failed: number;
  running: number;
  pending: number;
};

type DashboardMetrics = {
  totalAssets: number;
  activeAssets: number;
  inactiveAssets: number;
  maintenanceAssets: number;
  pendingAssets: number;
  retiredAssets: number;
  scansTotal: number;
  scansLast7Days: number;
  scanStatus: ScanStatusCount;
  weeklyTrend: Array<{ label: string; value: number }>;
  topAssetTypes: Array<{ label: string; value: number }>;
  lastScanDate: string | null;
};

const STATUS_THEME: Record<
  AssetStatus,
  { labelClass: string; dotClass: string; ringClass: string }
> = {
  active: {
    labelClass: 'text-green-300',
    dotClass: 'bg-green-400',
    ringClass: 'stroke-green-400',
  },
  inactive: {
    labelClass: 'text-gray-300',
    dotClass: 'bg-gray-400',
    ringClass: 'stroke-gray-400',
  },
  maintenance: {
    labelClass: 'text-amber-300',
    dotClass: 'bg-amber-400',
    ringClass: 'stroke-amber-400',
  },
  retired: {
    labelClass: 'text-red-300',
    dotClass: 'bg-red-400',
    ringClass: 'stroke-red-400',
  },
  pending: {
    labelClass: 'text-blue-300',
    dotClass: 'bg-blue-400',
    ringClass: 'stroke-blue-400',
  },
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value);

const formatDateTime = (value: string, locale: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale || 'es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getLast7DayBuckets = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      date,
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('es-ES', { weekday: 'short' }),
    };
  });
};

const buildWeeklyTrend = (createdAtList: string[]) => {
  const buckets = getLast7DayBuckets();
  const map = new Map<string, number>(buckets.map((item) => [item.key, 0]));

  createdAtList.forEach((dateString) => {
    const key = new Date(dateString).toISOString().slice(0, 10);
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + 1);
    }
  });

  return buckets.map((bucket) => ({
    label: bucket.label,
    value: map.get(bucket.key) || 0,
  }));
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getSecurityScore = (metrics: DashboardMetrics) => {
  if (metrics.totalAssets === 0) {
    return 0;
  }

  const activityRatio = (metrics.activeAssets / metrics.totalAssets) * 100;
  const scanCompleted = metrics.scanStatus.completed;
  const scanFailed = metrics.scanStatus.failed;
  const scanBase = scanCompleted + scanFailed;
  const reliabilityRatio = scanBase > 0 ? (scanCompleted / scanBase) * 100 : 0;
  const riskPressure =
    ((metrics.maintenanceAssets + metrics.pendingAssets + metrics.retiredAssets) /
      metrics.totalAssets) *
    100;

  return Math.round(clamp(activityRatio * 0.45 + reliabilityRatio * 0.4 + (100 - riskPressure) * 0.15, 0, 100));
};

const getScoreTone = (score: number) => {
  if (score >= 80) {
    return {
      text: 'text-green-300',
      chip: 'border-green-500/40 bg-green-500/10 text-green-200',
      ring: 'stroke-green-400',
    };
  }

  if (score >= 60) {
    return {
      text: 'text-amber-300',
      chip: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
      ring: 'stroke-amber-400',
    };
  }

  return {
    text: 'text-red-300',
    chip: 'border-red-500/40 bg-red-500/10 text-red-200',
    ring: 'stroke-red-400',
  };
};

const KpiCard = ({
  title,
  value,
  hint,
  icon,
  accent,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  accent: string;
}) => (
  <Card className="relative overflow-hidden border-gray-800 bg-gray-950/60 p-5">
    <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} aria-hidden="true" />
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <div className="text-gray-300">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-100">{value}</p>
    <p className="mt-2 text-sm text-gray-400">{hint}</p>
  </Card>
);

const DonutChart = ({
  segments,
  total,
  t,
}: {
  segments: Array<{ key: AssetStatus; value: number }>;
  total: number;
  t: (key: string, opts?: { defaultValue: string }) => string;
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
      <div className="mx-auto flex flex-col items-center">
        <p className="mb-3 text-xs uppercase tracking-wider text-gray-500">{t('appPages.dashboard.assetsLabel', { defaultValue: 'Activos' })}</p>
        <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-gray-800"
            strokeWidth="16"
            fill="none"
          />
          {segments.map((segment) => {
            const ratio = total > 0 ? segment.value / total : 0;
            const dash = circumference * ratio;
            const dashOffset = circumference - accumulated;
            accumulated += dash;

            return (
              <circle
                key={segment.key}
                cx="80"
                cy="80"
                r={radius}
                className={STATUS_THEME[segment.key].ringClass}
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="text-2xl font-bold text-gray-100">{formatNumber(total)}</p>
        </div>
      </div>
      </div>

      <ul className="space-y-2" aria-label="Distribución de activos">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between rounded-lg bg-gray-900/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_THEME[segment.key].dotClass}`} />
              <span className="text-sm text-gray-300 capitalize">{t(`appPages.dashboard.statusLabels.${segment.key}`, { defaultValue: segment.key })}</span>
            </div>
            <span className={`text-sm font-semibold ${STATUS_THEME[segment.key].labelClass}`}>
              {formatNumber(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TrendChart = ({ points }: { points: Array<{ label: string; value: number }> }) => {
  const max = Math.max(...points.map((point) => point.value), 1);
  const coordinates = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * 100;
      const y = 100 - (point.value / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div>
      <div className="h-44 rounded-xl border border-gray-800 bg-gray-900/70 p-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline
            fill="none"
            points={coordinates}
            className="stroke-blue-400"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((point, index) => {
            const x = (index / (points.length - 1 || 1)) * 100;
            const y = 100 - (point.value / max) * 100;

            return (
              <circle
                key={`${point.label}-${index}`}
                cx={x}
                cy={y}
                r="1.7"
                className="fill-blue-300"
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
        {points.map((point) => (
          <span key={point.label}>{point.label.replace('.', '')}</span>
        ))}
      </div>
    </div>
  );
};

export const DashboardHome = () => {
  const { t, i18n } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshSettings, setRefreshSettings] = useState(() => loadAppSettings().dashboard);

  const loadDashboardData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = Boolean(options?.silent);

    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const [
        allAssets,
        activeAssets,
        inactiveAssets,
        maintenanceAssets,
        pendingAssets,
        retiredAssets,
        allScans,
      ] = await Promise.all([
        getAssets({ page: 1, per_page: 100 }),
        getAssets({ page: 1, per_page: 1, status: 'active' }),
        getAssets({ page: 1, per_page: 1, status: 'inactive' }),
        getAssets({ page: 1, per_page: 1, status: 'maintenance' }),
        getAssets({ page: 1, per_page: 1, status: 'pending' }),
        getAssets({ page: 1, per_page: 1, status: 'retired' }),
        getScans({ page: 1, per_page: 120 }),
      ]);

      const scanStatusCounts = allScans.items.reduce<ScanStatusCount>(
        (accumulator, scan) => {
          if (scan.status === 'completed') {
            accumulator.completed += 1;
          } else if (scan.status === 'failed') {
            accumulator.failed += 1;
          } else if (scan.status === 'running') {
            accumulator.running += 1;
          } else if (scan.status === 'pending') {
            accumulator.pending += 1;
          }

          return accumulator;
        },
        { completed: 0, failed: 0, running: 0, pending: 0 },
      );

      const weeklyTrend = buildWeeklyTrend(allScans.items.map((scan) => scan.created_at));

      const last7DayTotal = weeklyTrend.reduce((sum, point) => sum + point.value, 0);

      const typesMap = new Map<string, number>();
      allAssets.items.forEach((asset) => {
        const type = asset.type || 'unknown';
        typesMap.set(type, (typesMap.get(type) || 0) + 1);
      });

      const topAssetTypes = Array.from(typesMap.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      setMetrics({
        totalAssets: allAssets.meta.total,
        activeAssets: activeAssets.meta.total,
        inactiveAssets: inactiveAssets.meta.total,
        maintenanceAssets: maintenanceAssets.meta.total,
        pendingAssets: pendingAssets.meta.total,
        retiredAssets: retiredAssets.meta.total,
        scansTotal: allScans.meta.total,
        scansLast7Days: last7DayTotal,
        scanStatus: scanStatusCounts,
        weeklyTrend,
        topAssetTypes,
        lastScanDate: allScans.items[0]?.created_at ?? null,
      });
    } catch (dashboardError: any) {
      setError(
        dashboardError?.message ||
          t('appPages.dashboard.error', {
            defaultValue: 'No se pudieron cargar las métricas del dashboard.',
          }),
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const settings = loadAppSettings();
    setRefreshSettings(settings.dashboard);
  }, []);

  useEffect(() => {
    if (!refreshSettings.autoRefresh) {
      return;
    }

    const intervalMs = refreshSettings.refreshInterval * 1000;
    const intervalId = window.setInterval(() => {
      void loadDashboardData({ silent: true });
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshSettings.autoRefresh, refreshSettings.refreshInterval, loadDashboardData]);

  const securityScore = useMemo(() => {
    if (!metrics) {
      return 0;
    }

    return getSecurityScore(metrics);
  }, [metrics]);

  const scoreTone = getScoreTone(securityScore);

  const statusSegments = useMemo(() => {
    if (!metrics) {
      return [] as Array<{ key: AssetStatus; value: number }>;
    }

    return [
      { key: 'active' as const, value: metrics.activeAssets },
      { key: 'maintenance' as const, value: metrics.maintenanceAssets },
      { key: 'pending' as const, value: metrics.pendingAssets },
      { key: 'inactive' as const, value: metrics.inactiveAssets },
      { key: 'retired' as const, value: metrics.retiredAssets },
    ];
  }, [metrics]);

  const scanSuccessRate = useMemo(() => {
    if (!metrics) {
      return 0;
    }

    const total = metrics.scanStatus.completed + metrics.scanStatus.failed;
    if (total === 0) {
      return 0;
    }

    return Math.round((metrics.scanStatus.completed / total) * 100);
  }, [metrics]);

  return (
    <section className="min-h-screen bg-gray-900 py-10 md:py-14">
      <Container size="xl">
        <div className="mb-6 grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
            <LayoutDashboard className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100 md:text-4xl">
              {t('appPages.dashboard.title')}
            </h1>
            <p className="mt-1 text-gray-400">
              {t('appPages.dashboard.description')}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              void loadDashboardData();
            }}
            className="justify-center"
            aria-label={t('appPages.dashboard.refresh', { defaultValue: 'Actualizar métricas' })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('appPages.dashboard.refresh', { defaultValue: 'Actualizar' })}
          </Button>
        </div>

        {loading ? (
          <Card className="flex min-h-[280px] items-center justify-center bg-gray-950/60">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-300" />
              <p className="text-gray-300">
                {t('appPages.dashboard.loading', {
                  defaultValue: 'Preparando tus métricas de ciberseguridad...',
                })}
              </p>
            </div>
          </Card>
        ) : error ? (
          <Card className="border-red-500/30 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
              <div>
                <p className="font-semibold text-red-200">
                  {t('appPages.dashboard.errorTitle', {
                    defaultValue: 'Error al cargar el dashboard',
                  })}
                </p>
                <p className="mt-1 text-sm text-red-200/90">{error}</p>
              </div>
            </div>
          </Card>
        ) : (
          metrics && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-gray-800 bg-gradient-to-br from-blue-500/10 via-gray-950 to-gray-900 p-0">
                <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                      <Radar className="h-3.5 w-3.5" />
                      {t('appPages.dashboard.pulse', { defaultValue: 'Security Pulse' })}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-100 md:text-3xl">
                      {t('appPages.dashboard.heroTitle', {
                        defaultValue: 'Visión ejecutiva de riesgo y resiliencia',
                      })}
                    </h2>
                    <p className="mt-2 max-w-2xl text-gray-300">
                      {t('appPages.dashboard.heroDescription', {
                        defaultValue:
                          'Monitoriza la salud de tus activos, la fiabilidad de tus escaneos y la presión de riesgo en tiempo real.',
                      })}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          {t('appPages.dashboard.lastScan', { defaultValue: 'Último escaneo' })}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-200">
                          {metrics.lastScanDate
                            ? formatDateTime(metrics.lastScanDate, i18n.language)
                            : '-'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          {t('appPages.dashboard.scanReliability', {
                            defaultValue: 'Fiabilidad de escaneo',
                          })}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-200">
                          {scanSuccessRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-end">
                    <div className="flex flex-col items-center">
                      <p className="mb-3 text-xs uppercase tracking-wider text-gray-500">
                        {t('appPages.dashboard.securityScore', { defaultValue: 'Security Score' })}
                      </p>
                      <div className="relative grid h-44 w-44 place-items-center rounded-full border border-gray-700 bg-gray-950/70">
                      <svg viewBox="0 0 180 180" className="absolute inset-0 h-full w-full -rotate-90">
                        <circle cx="90" cy="90" r="74" strokeWidth="12" className="stroke-gray-800" fill="none" />
                        <circle
                          cx="90"
                          cy="90"
                          r="74"
                          strokeWidth="12"
                          fill="none"
                          className={scoreTone.ring}
                          strokeDasharray={`${(2 * Math.PI * 74 * securityScore) / 100} ${2 * Math.PI * 74}`}
                          strokeLinecap="round"
                        />
                      </svg>
                        <div className="text-center">
                          <p className={`text-4xl font-bold ${scoreTone.text}`}>{securityScore}</p>
                          <p className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${scoreTone.chip}`}>
                            {securityScore >= 80
                              ? t('appPages.dashboard.scoreHigh', { defaultValue: 'Excelente' })
                              : securityScore >= 60
                                ? t('appPages.dashboard.scoreMedium', { defaultValue: 'Estable' })
                                : t('appPages.dashboard.scoreLow', { defaultValue: 'Crítico' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  title={t('appPages.dashboard.kpi.totalAssets', { defaultValue: 'Activos totales' })}
                  value={formatNumber(metrics.totalAssets)}
                  hint={`${formatNumber(metrics.activeAssets)} ${t('appPages.dashboard.kpi.activeHint', { defaultValue: 'activos operativos' })}`}
                  icon={<Server className="h-5 w-5" />}
                  accent="bg-blue-500"
                />
                <KpiCard
                  title={t('appPages.dashboard.kpi.scansTotal', { defaultValue: 'Escaneos ejecutados' })}
                  value={formatNumber(metrics.scansTotal)}
                  hint={`${formatNumber(metrics.scansLast7Days)} ${t('appPages.dashboard.kpi.weekHint', { defaultValue: 'en los últimos 7 días' })}`}
                  icon={<Radar className="h-5 w-5" />}
                  accent="bg-violet-500"
                />
                <KpiCard
                  title={t('appPages.dashboard.kpi.successRate', {
                    defaultValue: 'Tasa de éxito',
                  })}
                  value={`${scanSuccessRate}%`}
                  hint={`${formatNumber(metrics.scanStatus.completed)} ${t('appPages.dashboard.kpi.completedHint', { defaultValue: 'completados' })}`}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  accent="bg-green-500"
                />
                <KpiCard
                  title={t('appPages.dashboard.kpi.riskLoad', { defaultValue: 'Carga de riesgo' })}
                  value={formatNumber(metrics.scanStatus.failed + metrics.pendingAssets + metrics.maintenanceAssets)}
                  hint={t('appPages.dashboard.kpi.riskHint', {
                    defaultValue: 'Incidencias + activos no estables',
                  })}
                  icon={<AlertTriangle className="h-5 w-5" />}
                  accent="bg-red-500"
                />
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
                <Card className="border-gray-800 bg-gray-950/60">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {t('appPages.dashboard.assetsStatus', {
                        defaultValue: 'Distribución de activos por estado',
                      })}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {t('appPages.dashboard.realData', { defaultValue: 'Datos reales' })}
                    </span>
                  </div>
                  <DonutChart segments={statusSegments} total={metrics.totalAssets} t={t} />
                </Card>

                <Card className="border-gray-800 bg-gray-950/60">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {t('appPages.dashboard.weeklyTrend', {
                        defaultValue: 'Tendencia semanal de escaneos',
                      })}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {t('appPages.dashboard.last7Days', { defaultValue: 'Últimos 7 días' })}
                    </span>
                  </div>
                  <TrendChart points={metrics.weeklyTrend} />
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <Card className="border-gray-800 bg-gray-950/60">
                  <h3 className="mb-4 text-lg font-semibold text-gray-100">
                    {t('appPages.dashboard.scanPipeline', {
                      defaultValue: 'Pipeline de escaneos',
                    })}
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-green-500/25 bg-green-500/10 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-green-200">
                          <CheckCircle2 className="h-4 w-4" />
                          {t('appPages.dashboard.completed', { defaultValue: 'Completados' })}
                        </span>
                        <span className="text-xl font-bold text-green-200">
                          {formatNumber(metrics.scanStatus.completed)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-blue-200">
                          <Clock3 className="h-4 w-4" />
                          {t('appPages.dashboard.runningPending', {
                            defaultValue: 'En curso + pendientes',
                          })}
                        </span>
                        <span className="text-xl font-bold text-blue-200">
                          {formatNumber(metrics.scanStatus.running + metrics.scanStatus.pending)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-red-200">
                          <XCircle className="h-4 w-4" />
                          {t('appPages.dashboard.failed', { defaultValue: 'Fallidos' })}
                        </span>
                        <span className="text-xl font-bold text-red-200">
                          {formatNumber(metrics.scanStatus.failed)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-gray-800 bg-gray-950/60">
                  <h3 className="mb-4 text-lg font-semibold text-gray-100">
                    {t('appPages.dashboard.insightsTitle', {
                      defaultValue: 'Insights de negocio',
                    })}
                  </h3>
                  <ul className="space-y-3">
                    <li className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-sm text-gray-300">
                      <span className="font-semibold text-gray-100">
                        {t('appPages.dashboard.insightCoverage', {
                          defaultValue: 'Cobertura operativa',
                        })}
                        :
                      </span>{' '}
                      {metrics.totalAssets > 0
                        ? Math.round((metrics.activeAssets / metrics.totalAssets) * 100)
                        : 0}
                      % {t('appPages.dashboard.insightCoverageText', { defaultValue: 'de activos están en estado activo' })}.
                    </li>
                    <li className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-sm text-gray-300">
                      <span className="font-semibold text-gray-100">
                        {t('appPages.dashboard.insightRisk', { defaultValue: 'Riesgo emergente' })}:
                      </span>{' '}
                      {metrics.pendingAssets + metrics.maintenanceAssets} {t('appPages.dashboard.insightRiskText', { defaultValue: 'activos requieren atención preventiva' })}.
                    </li>
                    <li className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-sm text-gray-300">
                      <span className="font-semibold text-gray-100">
                        {t('appPages.dashboard.insightType', { defaultValue: 'Tipología dominante' })}:
                      </span>{' '}
                      {metrics.topAssetTypes[0]
                        ? `${metrics.topAssetTypes[0].label} (${metrics.topAssetTypes[0].value})`
                        : t('appPages.dashboard.noData', { defaultValue: 'Sin datos suficientes' })}
                    </li>
                  </ul>

                  <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-100">
                    <div className="flex items-center gap-2 font-semibold">
                      <Shield className="h-4 w-4" />
                      {t('appPages.dashboard.recommendation', {
                        defaultValue: 'Recomendación prioritaria',
                      })}
                    </div>
                    <p className="mt-1 text-blue-100/90">
                      {metrics.scanStatus.failed > 0
                        ? t('appPages.dashboard.recommendationFailed', {
                            defaultValue:
                              'Reduce fallos en escaneos para aumentar el score global y mejorar la confianza operativa.',
                          })
                        : t('appPages.dashboard.recommendationStable', {
                            defaultValue:
                              'Mantén la cadencia de escaneo y enfócate en activos en maintenance/pending para sostener el rendimiento.',
                          })}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )
        )}
      </Container>
    </section>
  );
};
