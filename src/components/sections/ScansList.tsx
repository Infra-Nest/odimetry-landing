import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { getScans } from '../../services/scanService';
import type { Scan, ScanStatus, ScanType } from '../../types/scan';
import { Search, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const STATUS_COLORS: Record<ScanStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-blue-900/30', text: 'text-blue-400' },
  running: { bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
  completed: { bg: 'bg-green-900/30', text: 'text-green-400' },
  failed: { bg: 'bg-red-900/30', text: 'text-red-400' },
};

export const ScansList = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  // State
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScanStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ScanType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(25);

  // Fetch scans
  const fetchScans = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page,
        per_page: perPage,
        status: statusFilter ? [statusFilter as ScanStatus] : undefined,
        scan_type: typeFilter ? [typeFilter as ScanType] : undefined,
        asset_name: search || undefined,
      };
      
      const data = await getScans(filters);
      setScans(data.items);
      setCurrentPage(data.meta.page);
      setTotalPages(data.meta.total_pages);
    } catch (err: any) {
      setError(err?.message || translate('scans.errors.fetchFailed', 'Failed to fetch scans'));
    } finally {
      setLoading(false);
    }
  };

  // Load scans on mount and when filters change
  useEffect(() => {
    fetchScans(1);
  }, [search, statusFilter, typeFilter]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: ScanStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: ScanType | '') => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const getStatusLabel = (status: ScanStatus): string => {
    return translate(`scans.status.${status}`, status);
  };

  const getTypeLabel = (type: ScanType): string => {
    return translate(`scans.type.${type}`, type);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('es-ES');
  };

  const getDuration = (startedAt: string | undefined, finishedAt: string | undefined): string => {
    if (!startedAt || !finishedAt) return '-';
    const start = new Date(startedAt).getTime();
    const finish = new Date(finishedAt).getTime();
    const seconds = Math.round((finish - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    return `${hours}h`;
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white min-h-screen" aria-labelledby="scans-heading">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 id="scans-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
              {translate('scans.title', 'Scans')}
            </h1>
            <p className="text-gray-400">{translate('scans.subtitle', 'View and manage your security scans')}</p>
          </div>
          <Button variant="primary" size="md" className="mt-4 md:mt-0 flex items-center gap-2" onClick={() => navigate('/scans/new')}>
            <Plus className="w-4 h-4" />
            {translate('scans.startNew', 'Start New Scan')}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={translate('scans.searchPlaceholder', 'Search by asset name...')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange((e.target.value as ScanStatus) || '')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">{translate('scans.allStatuses', 'All Statuses')}</option>
            <option value="pending">{translate('scans.status.pending', 'Pending')}</option>
            <option value="running">{translate('scans.status.running', 'Running')}</option>
            <option value="completed">{translate('scans.status.completed', 'Completed')}</option>
            <option value="failed">{translate('scans.status.failed', 'Failed')}</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange((e.target.value as ScanType) || '')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">{translate('scans.allTypes', 'All Types')}</option>
            <option value="full">{translate('scans.type.full', 'Full Scan')}</option>
            <option value="quick">{translate('scans.type.quick', 'Quick Scan')}</option>
            <option value="custom">{translate('scans.type.custom', 'Custom Scan')}</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-medium text-sm mb-1">{translate('scans.errors.error', 'Error')}</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Scans Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              {translate('scans.loading', 'Loading scans...')}
            </div>
          ) : scans.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {translate('scans.noScans', 'No scans found')}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('scans.table.assetName', 'Asset Name')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('scans.table.type', 'Type')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('scans.table.status', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('scans.table.createdAt', 'Created')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('scans.table.duration', 'Duration')}
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                        {translate('scans.table.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((scan) => (
                      <tr key={scan.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-100">{scan.asset_name || `Asset #${scan.asset_id}`}</p>
                            <p className="text-xs text-gray-500">ID: {scan.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300 text-sm">{getTypeLabel(scan.scan_type)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[scan.status].bg} ${STATUS_COLORS[scan.status].text}`}
                          >
                            {getStatusLabel(scan.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          <div>
                            <p>{formatDate(scan.created_at)}</p>
                            <p className="text-xs text-gray-500">{formatTime(scan.created_at)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {scan.status === 'completed' || scan.status === 'failed'
                            ? getDuration(scan.started_at, scan.finished_at)
                            : scan.status === 'running'
                            ? translate('scans.inProgress', 'In progress...')
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/scans/${scan.id}`)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            {translate('scans.table.view', 'View')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {translate('scans.pagination.page', 'Page')} {currentPage} {translate('scans.pagination.of', 'of')}{' '}
                    {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchScans(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => fetchScans(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
};
