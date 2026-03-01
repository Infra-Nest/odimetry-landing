import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { getAssets } from '../../services/assetsService';
import type { Asset, AssetStatus } from '../../types/assets';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_COLORS: Record<AssetStatus, { bg: string; text: string }> = {
  active: { bg: 'bg-green-900/30', text: 'text-green-400' },
  inactive: { bg: 'bg-gray-700/30', text: 'text-gray-400' },
  maintenance: { bg: 'bg-amber-900/30', text: 'text-amber-400' },
  retired: { bg: 'bg-red-900/30', text: 'text-red-400' },
  pending: { bg: 'bg-blue-900/30', text: 'text-blue-400' },
};

export const Assets = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  // State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(25);

  // Fetch assets
  const fetchAssets = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssets({
        page,
        per_page: perPage,
        status: (statusFilter as AssetStatus) || undefined,
        search: search || undefined,
      });
      
      // Filter out assets with undefined status when a specific status is selected
      let filteredAssets = data.items;
      if (statusFilter) {
        filteredAssets = data.items.filter(asset => asset.status !== undefined);
      }
      
      setAssets(filteredAssets);
      setCurrentPage(data.meta.page);
      setTotalPages(data.meta.total_pages);
    } catch (err: any) {
      setError(err?.message || translate('assets.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Load assets on mount and when filters change
  useEffect(() => {
    fetchAssets(1);
  }, [search, statusFilter]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: AssetStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getStatusLabel = (status?: AssetStatus): string => {
    if (!status) return translate('assets.status.unknown', 'Unknown');
    return translate(`assets.status.${status}`, status);
  };

  const getStatusColor = (status?: AssetStatus) => {
    if (!status) return { bg: 'bg-gray-700/30', text: 'text-gray-400' };
    return STATUS_COLORS[status] || { bg: 'bg-gray-700/30', text: 'text-gray-400' };
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white min-h-screen" aria-labelledby="assets-heading">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 id="assets-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
              {translate('assets.title', 'Assets')}
            </h1>
            <p className="text-gray-400">{translate('assets.subtitle', 'Manage and monitor your organization assets')}</p>
          </div>
          <Button variant="primary" size="md" className="mt-4 md:mt-0 flex items-center gap-2" onClick={() => navigate('/assets/new')}>
            <Plus className="w-4 h-4" />
            {translate('assets.addNew', 'Add Asset')}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={translate('assets.searchPlaceholder', 'Search by name or type...')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange((e.target.value as AssetStatus) || '')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">{translate('assets.allStatuses', 'All Statuses')}</option>
            <option value="active">{translate('assets.status.active', 'Active')}</option>
            <option value="inactive">{translate('assets.status.inactive', 'Inactive')}</option>
            <option value="maintenance">{translate('assets.status.maintenance', 'Maintenance')}</option>
            <option value="retired">{translate('assets.status.retired', 'Retired')}</option>
            <option value="pending">{translate('assets.status.pending', 'Pending')}</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-medium text-sm mb-1">{translate('assets.errors.error', 'Error')}</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Assets Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              {translate('assets.loading', 'Loading assets...')}
            </div>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {translate('assets.noAssets', 'No assets found')}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('assets.table.name', 'Name')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('assets.table.type', 'Type')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('assets.table.status', 'Status')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('assets.table.location', 'Location')}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                        {translate('assets.table.createdAt', 'Created')}
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                        {translate('assets.table.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-100">{asset.name}</p>
                            {asset.asset_tag && <p className="text-xs text-gray-500">{asset.asset_tag}</p>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{asset.type}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status).bg} ${getStatusColor(asset.status).text}`}
                          >
                            {getStatusLabel(asset.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{asset.location || '-'}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(asset.created_at)}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                            {translate('assets.table.view', 'View')}
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
                    {translate('assets.pagination.page', 'Page')} {currentPage} {translate('assets.pagination.of', 'of')}{' '}
                    {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchAssets(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => fetchAssets(currentPage + 1)}
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
