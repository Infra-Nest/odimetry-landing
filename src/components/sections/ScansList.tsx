import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Scan, ScanHistoryFilters, ScanStatus } from "../../types/scan";
import { getScanHistory } from "../../services/scanService";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { LockOpen, Lock } from "lucide-react";

const STATUS_STYLES: Record<ScanStatus, string> = {
  pending: "bg-amber-950/40 border-amber-600 text-amber-400",
  running: "bg-blue-950/40 border-blue-600 text-blue-400",
  completed: "bg-green-950/40 border-green-600 text-green-400",
  failed: "bg-red-950/40 border-red-600 text-red-400",
};

export const ScansList = () => {
  const { t } = useTranslation();
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<ScanHistoryFilters>({
    limit: 50,
    offset: 0,
    sort_by: "created_at",
    order: "desc",
  });

  /** * TODO: Replace with useAuth() hook once AuthContext is available.
   * Accessing localStorage directly is a temporary solution for current development.
   */
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    if (!token) {
      setError(t("errors.noToken"));
      return;
    }

    const fetchScans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getScanHistory(filters, token);
        setScans(response.results);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.fetchScan"));
        setScans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScans();
  }, [filters, token, t, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNextPage = () => {
    setFilters((prev) => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 50),
    }));
  };

  const handlePreviousPage = () => {
    const newOffset = Math.max(
      0,
      (filters.offset || 0) - (filters.limit || 50),
    );
    setFilters((prev) => ({ ...prev, offset: newOffset }));
  };

  const handleStatusFilter = (status: ScanStatus) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status?.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...(prev.status || []), status],
      offset: 0,
    }));
  };

  const currentPage =
    Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 50));
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <section className="py-12 bg-gray-900 min-h-screen">
      <Container>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-100">
                {t("scans.title")}
              </h2>
              <p className="mt-2 text-gray-400">
                {t("scans.total")}:{" "}
                <span className="font-semibold text-gray-200">{total}</span>
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? t("common.loading") : t("common.refresh")}
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {(
              ["pending", "running", "completed", "failed"] as ScanStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  filters.status?.includes(status)
                    ? "bg-gray-700 border-blue-500 text-blue-400"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t(`status.${status}`)}
              </button>
            ))}
          </div>

          {/* Error State General */}
          {error && (
            <div className="bg-red-950/40 border border-red-600 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !scans.length && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-400"></div>
              <p className="mt-4 text-gray-400">{t("common.loadingScans")}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && scans.length === 0 && !error && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">{t("scans.noScans")}</p>
            </div>
          )}

          {/* Scans List */}
          {scans.length > 0 && (
            <div className="space-y-4">
              {scans.map((scan) => (
                <Card
                  key={scan.id}
                  className="p-6 bg-gray-800 border-gray-700 hover:shadow-xl transition-shadow shadow-black/40"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-100">
                          {scan.asset_name ||
                            `${t("scans.asset")} ${scan.asset_id}`}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[scan.status]}`}
                        >
                          {t(`status.${scan.status}`)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("scans.scanId")}: {scan.id}
                      </p>
                    </div>
                  </div>

                  {/* Grid fields: Type, Created, Started, Finished */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {t("scans.fields.type")}
                      </p>
                      <p className="font-medium text-gray-200 capitalize">
                        {scan.scan_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {t("scans.fields.created")}
                      </p>
                      <p className="font-medium text-gray-200">
                        {new Date(scan.created_at).toLocaleString()}
                      </p>
                    </div>
                    {scan.started_at && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {t("scans.fields.started")}
                        </p>
                        <p className="font-medium text-gray-200">
                          {new Date(scan.started_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {scan.finished_at && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {t("scans.fields.finished")}
                        </p>
                        <p className="font-medium text-gray-200">
                          {new Date(scan.finished_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hosts Scanned */}
                  {scan.hosts && scan.hosts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {t("scans.hostsScanned")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scan.hosts.map((host) => (
                          <span
                            key={host.id}
                            className="bg-gray-800 text-gray-300 border border-gray-700 px-2 py-1 rounded text-sm"
                          >
                            {host.hostname || host.ip_address}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ports Found */}
                  {scan.ports && scan.ports.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {t("scans.portsFound")}: {scan.ports.length}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scan.ports.slice(0, 5).map((port) => (
                          <span
                            key={port.id}
                            className={`px-2 py-1 rounded border text-sm font-medium flex items-center gap-1 ${
                              port.state === "open"
                                ? "bg-red-950/40 text-red-400"
                                : port.state === "closed"
                                  ? "bg-green-950/40 text-green-400"
                                  : "bg-amber-950/40 text-amber-400"
                            }`}
                          >
                            {port.port}/{port.protocol}{" "}
                            {port.state === "open" ? (
                              <LockOpen size={14} aria-hidden="true" />
                            ) : (
                              <Lock size={14} aria-hidden="true" />
                            )}
                          </span>
                        ))}
                        {scan.ports.length > 5 && (
                          <span className="px-2 py-1 text-sm text-gray-500">
                            +{scan.ports.length - 5} {t("common.more")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Individual Scan Error Message */}
                  {scan.error_message && (
                    <div className="mt-4 p-4 bg-red-950/40 border border-red-600 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <span className="font-bold text-red-100 text-sm block mb-1 uppercase tracking-tight">
                            {t("common.error")}
                          </span>
                          <p className="text-sm text-red-200 leading-relaxed">
                            {scan.error_message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {total > (filters.limit || 50) && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
              <div className="text-sm text-gray-500">
                {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
                {totalPages} ({total} {t("pagination.total")})
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isLoading}
                  variant="secondary"
                  className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  {t("pagination.previous")}
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isLoading}
                  variant="secondary"
                  className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
