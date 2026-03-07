import { useEffect, useMemo, useState } from 'react';
import { BellRing, Building2, Globe, LayoutDashboard, MonitorCog, Moon, Settings, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import {
  applyThemeMode,
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  saveAppSettings,
  type AppSettings,
  type DashboardSettings,
  type SupportedLanguage,
  type ThemeMode,
} from '../../utils/appSettings';
import { getUserOrganizations, updateUserProfile } from '../../services/userService';
import type { UserOrganization } from '../../types/user';

const REFRESH_INTERVALS: Array<DashboardSettings['refreshInterval']> = [30, 60, 300, 900];

const themeIconMap: Record<ThemeMode, React.ReactNode> = {
  light: <Sun className="h-4 w-4" aria-hidden="true" />,
  dark: <Moon className="h-4 w-4" aria-hidden="true" />,
  system: <MonitorCog className="h-4 w-4" aria-hidden="true" />,
};

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>(() => {
    const loaded = loadAppSettings();
    return {
      ...loaded,
      language: (loaded.language || i18n.language || 'es') as SupportedLanguage,
    };
  });
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
    const [savingOrganization, setSavingOrganization] = useState(false);

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrganizations(true);
        const orgs = await getUserOrganizations();
        setOrganizations(orgs);
      } catch {
        setOrganizations([]);
      } finally {
        setLoadingOrganizations(false);
      }
    };

    void fetchOrganizations();
  }, []);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
    applyThemeMode(theme);
  };

  const setLanguage = async (language: SupportedLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
    await i18n.changeLanguage(language);
  };

  const setDashboardAutoRefresh = (enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        autoRefresh: enabled,
      },
    }));
  };

  const setDashboardRefreshInterval = (interval: DashboardSettings['refreshInterval']) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        refreshInterval: interval,
      },
    }));
  };

  const setDefaultOrganization = async (organizationId: string) => {
    try {
      setSavingOrganization(true);

      await updateUserProfile({
        default_organization_id: organizationId || null,
      });

      setSettings((prev) => ({
        ...prev,
        defaultOrganizationId: organizationId || undefined,
      }));
    } catch {
      // Keep current value on error
    } finally {
      setSavingOrganization(false);
    }
  };

  const themeModes = useMemo<Array<ThemeMode>>(() => ['system', 'light', 'dark'], []);

  const dashboardSettings = settings.dashboard || DEFAULT_APP_SETTINGS.dashboard;

  return (
    <section className="min-h-screen bg-gray-900 py-10 md:py-14">
      <Container size="xl">
        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-8 md:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
            <Settings className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-bold text-gray-100 md:text-4xl">
            {t('appPages.settings.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-300">
            {t('appPages.settings.description')}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <div className="flex items-center gap-2 text-gray-100">
                <Sun className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <h2 className="text-lg font-semibold">
                  {t('appPages.settings.appearance.title')}
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {t('appPages.settings.appearance.description')}
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {themeModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      settings.theme === mode
                        ? 'border-blue-500/70 bg-blue-500/15 text-blue-200'
                        : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    {themeIconMap[mode]}
                    <span>{t(`appPages.settings.appearance.themeOptions.${mode}`)}</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <div className="flex items-center gap-2 text-gray-100">
                <Globe className="h-4 w-4 text-blue-300" aria-hidden="true" />
                <h2 className="text-lg font-semibold">
                  {t('appPages.settings.language.title')}
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {t('appPages.settings.language.description')}
              </p>

              <label htmlFor="settings-language" className="mt-4 block text-sm font-medium text-gray-300">
                {t('appPages.settings.language.label')}
              </label>
              <select
                id="settings-language"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition-colors focus:border-blue-500"
                value={settings.language}
                onChange={(event) => void setLanguage(event.target.value as SupportedLanguage)}
              >
                <option value="es">{t('appPages.settings.language.options.es')}</option>
                <option value="en">{t('appPages.settings.language.options.en')}</option>
                <option value="fr">{t('appPages.settings.language.options.fr')}</option>
                <option value="de">{t('appPages.settings.language.options.de')}</option>
              </select>
            </article>

            <article className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
              <div className="flex items-center gap-2 text-gray-100">
                <Building2 className="h-4 w-4 text-purple-300" aria-hidden="true" />
                <h2 className="text-lg font-semibold">
                  {t('appPages.settings.organization.title', {
                    defaultValue: 'Organización predeterminada',
                  })}
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {t('appPages.settings.organization.description', {
                  defaultValue: 'Selecciona la organización que se cargará automáticamente al iniciar sesión.',
                })}
              </p>

              <label htmlFor="settings-organization" className="mt-4 block text-sm font-medium text-gray-300">
                {t('appPages.settings.organization.label', {
                  defaultValue: 'Organización',
                })}
              </label>
              <select
                id="settings-organization"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                value={settings.defaultOrganizationId || ''}
                onChange={(event) => void setDefaultOrganization(event.target.value)}
                disabled={loadingOrganizations || organizations.length === 0 || savingOrganization}
              >
                <option value="">
                  {loadingOrganizations
                    ? t('appPages.settings.organization.loading', { defaultValue: 'Cargando...' })
                    : organizations.length === 0
                      ? t('appPages.settings.organization.noOrganizations', {
                          defaultValue: 'Sin organizaciones',
                        })
                      : t('appPages.settings.organization.selectPlaceholder', {
                          defaultValue: 'Seleccionar organización',
                        })}
                </option>
                {organizations.map((org) => (
                  <option key={org.organization_id} value={org.organization_id}>
                    {org.name}
                    {org.role ? ` (${org.role})` : ''}
                  </option>
                ))}
              </select>
            </article>

            <article className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 lg:col-span-2">
              <div className="flex items-center gap-2 text-gray-100">
                <LayoutDashboard className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <h2 className="text-lg font-semibold">
                  {t('appPages.settings.dashboard.title')}
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {t('appPages.settings.dashboard.description')}
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-950/50 p-4">
                  <input
                    type="checkbox"
                    checked={dashboardSettings.autoRefresh}
                    onChange={(event) => setDashboardAutoRefresh(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-100">
                      {t('appPages.settings.dashboard.autoRefreshLabel')}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {t('appPages.settings.dashboard.autoRefreshHint')}
                    </span>
                  </span>
                </label>

                <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4">
                  <label htmlFor="settings-refresh-interval" className="block text-sm font-medium text-gray-300">
                    {t('appPages.settings.dashboard.refreshIntervalLabel')}
                  </label>
                  <select
                    id="settings-refresh-interval"
                    className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    value={dashboardSettings.refreshInterval}
                    onChange={(event) => setDashboardRefreshInterval(Number(event.target.value) as DashboardSettings['refreshInterval'])}
                    disabled={!dashboardSettings.autoRefresh}
                  >
                    {REFRESH_INTERVALS.map((interval) => (
                      <option key={interval} value={interval}>
                        {t(`appPages.settings.dashboard.intervalOptions.${interval}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
            <BellRing className="h-4 w-4" aria-hidden="true" />
            {t('appPages.settings.saved')}
          </div>
        </div>
      </Container>
    </section>
  );
};
