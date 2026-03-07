import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { createAsset } from '../../services/assetsService';
import type { Asset } from '../../types/assets';
import { ArrowLeft } from 'lucide-react';

const ASSET_TYPES = ['domain', 'host', 'ip'];
const ASSET_STATUSES = ['active', 'inactive', 'maintenance'];

export const CreateAsset = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [serial, setSerial] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [status, setStatus] = useState('active');
  const [location, setLocation] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const validate = () => {
    if (!name.trim()) return translate('createAsset.errors.nameRequired', 'Asset name is required');
    if (!type.trim()) return translate('createAsset.errors.typeRequired', 'Asset type is required');
    if (!value.trim()) return translate('createAsset.errors.valueRequired', 'Asset value is required');
    if (!ASSET_TYPES.includes(type)) return translate('createAsset.errors.invalidType', 'Invalid asset type');
    if (!ASSET_STATUSES.includes(status)) return translate('createAsset.errors.invalidStatus', 'Invalid status');
    return null;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      
      const orgId = parseInt(localStorage.getItem('organization_id') || '0', 10);
      const userId = parseInt(localStorage.getItem('user_id') || '0', 10);
      
      if (!orgId) {
        throw new Error('Organization not found. Please log in again.');
      }

      const assetData: Partial<Asset> = {
        name,
        type,
        value,
        status: status as any,
        client_id: orgId.toString(),
        organization_id: orgId.toString(),
        owner_id: userId ? userId.toString() : undefined,
        serial: serial || undefined,
        asset_tag: assetTag || undefined,
        location: location || undefined,
        warranty: warrantyMonths || undefined,
      };

      await createAsset(assetData);

      // Redirect to assets list on success
      navigate('/assets');
    } catch (err: any) {
      setError(err?.message || translate('createAsset.errors.general', 'Failed to create asset'));
      console.error('Create asset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white min-h-screen" aria-labelledby="create-asset-heading">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/assets')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {translate('createAsset.backToList', 'Back to Assets')}
          </button>
          <h1 id="create-asset-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
            {translate('createAsset.title', 'Create New Asset')}
          </h1>
          <p className="text-gray-400">{translate('createAsset.subtitle', 'Add a new asset to your organization')}</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name (Required) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                {translate('createAsset.fields.name', 'Asset Name')} *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translate('createAsset.placeholders.name', 'e.g., Server 01, Laptop XYZ')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Type (Required) */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                {translate('createAsset.fields.type', 'Asset Type')} *
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              >
                <option value="">{translate('createAsset.selectType', 'Select asset type...')}</option>
                <option value="domain">{translate('createAsset.types.domain', 'Domain')}</option>
                <option value="host">{translate('createAsset.types.host', 'Host')}</option>
                <option value="ip">{translate('createAsset.types.ip', 'IP Address')}</option>
              </select>
            </div>

            {/* Value (Required) */}
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">
                {translate('createAsset.fields.value', 'Value')} *
              </label>
              <input
                id="value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  type === 'domain'
                    ? 'example.com'
                    : type === 'host'
                    ? 'server01.example.com'
                    : type === 'ip'
                    ? '192.168.1.1'
                    : translate('createAsset.placeholders.value', 'Enter asset value')
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {type === 'domain' && translate('createAsset.hints.domain', 'Enter the domain name (e.g., example.com)')}
                {type === 'host' && translate('createAsset.hints.host', 'Enter the host name (e.g., server.example.com)')}
                {type === 'ip' && translate('createAsset.hints.ip', 'Enter the IP address (e.g., 192.168.1.1)')}
              </p>
            </div>

            {/* Serial and Asset Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="serial" className="block text-sm font-medium text-gray-300 mb-1">
                  {translate('createAsset.fields.serial', 'Serial Number')}
                </label>
                <input
                  id="serial"
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="SN123456"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="assetTag" className="block text-sm font-medium text-gray-300 mb-1">
                  {translate('createAsset.fields.assetTag', 'Asset Tag')}
                </label>
                <input
                  id="assetTag"
                  type="text"
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                  placeholder="AST-001"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status (Required) */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                {translate('createAsset.fields.status', 'Status')} *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              >
                <option value="active">{translate('createAsset.status.active', 'Active')}</option>
                <option value="inactive">{translate('createAsset.status.inactive', 'Inactive')}</option>
                <option value="maintenance">{translate('createAsset.status.maintenance', 'Maintenance')}</option>
              </select>
            </div>

            {/* Location and Warranty Months */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  {translate('createAsset.fields.location', 'Location')}
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={translate('createAsset.placeholders.location', 'e.g., Office Building A, Room 201')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="warrantyMonths" className="block text-sm font-medium text-gray-300 mb-1">
                  {translate('createAsset.fields.warrantyMonths', 'Warranty (months)')}
                </label>
                <input
                  id="warrantyMonths"
                  type="number"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(e.target.value)}
                  placeholder={translate('createAsset.placeholders.warrantyMonths', 'e.g., 12')}
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate('/assets')}
                disabled={loading}
              >
                {translate('createAsset.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={loading}>
                {loading
                  ? translate('createAsset.creating', 'Creating...')
                  : translate('createAsset.create', 'Create Asset')}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};
