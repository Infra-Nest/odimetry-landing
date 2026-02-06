import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Scan, ScanHistoryFilters, ScanStatus } from '../../types/scan';
import { getScanHistory } from '../../services/scanService';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export default function ScansList() {
  const { t } = useTranslation();
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ScanHistoryFilters>({
    limit: 50,
    offset: 0,
    sort_by: 'created_at',
    order: 'desc',
  });

  // Get token from localStorage or auth context
  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    if (!token) {
      setError('No authentication token found');
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
        setError(err instanceof Error ? err.message : 'Failed to fetch scans');
        setScans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScans();
  }, [filters, token]);

  const handleRefresh = () => {
    setFilters(prev => ({ ...prev }));
  };

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 50),
    }));
  };

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, (filters.offset || 0) - (filters.limit || 50));
    setFilters(prev => ({
      ...prev,
      offset: newOffset,
    }));
  };

  const handleStatusFilter = (status: ScanStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status?.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...(prev.status || []), status],
      offset: 0,
    }));
  };

  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1;
  const totalPages = Math.ceil(total / (filters.limit || 50));
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const statusColors: Record<ScanStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <section className="py-12">
      <Container>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Scan History</h2>
              <p className="mt-2 text-gray-600">
                Total scans: <span className="font-semibold">{total}</span>
              </p>
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['pending', 'running', 'completed', 'failed'] as ScanStatus[]).map(
              status => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.status?.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !scans.length && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading scans...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && scans.length === 0 && !error && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No scans found</p>
            </div>
          )}

          {/* Scans List */}
          {scans.length > 0 && (
            <div className="space-y-4">
              {scans.map(scan => (
                <Card key={scan.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {scan.asset_name || `Asset ${scan.asset_id}`}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[scan.status]
                          }`}
                        >
                          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Scan ID: {scan.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {scan.scan_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">
                        Created
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {scan.started_at && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Started
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(scan.started_at).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    {scan.finished_at && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Finished
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(scan.finished_at).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hosts */}
                  {scan.hosts && scan.hosts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                        Hosts Scanned
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scan.hosts.map(host => (
                          <span key={host.id} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                            {host.hostname || host.ip_address}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ports */}
                  {scan.ports && scan.ports.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                        Ports Found: {scan.ports.length}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scan.ports.slice(0, 5).map(port => (
                          <span
                            key={port.id}
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              port.state === 'open'
                                ? 'bg-red-100 text-red-800'
                                : port.state === 'closed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {port.port}/{port.protocol} {port.state === 'open' ? '🔓' : '🔒'}
                          </span>
                        ))}
                        {scan.ports.length > 5 && (
                          <span className="px-2 py-1 text-sm text-gray-600">
                            +{scan.ports.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {scan.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                      <strong>Error:</strong> {scan.error_message}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > (filters.limit || 50) && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isLoading}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isLoading}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
