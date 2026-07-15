import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { listAssets } from '../../services/assetService';
import type { Asset } from '../../types/asset';
import type { ScanType } from '../../types/scan';

interface NewScanModalProps {
  organizationId: number;
  organizationName?: string;
  onClose: () => void;
}

const SCAN_TYPES: ScanType[] = ['port_service'];

export const NewScanModal = ({
  organizationId,
  organizationName,
  onClose,
}: NewScanModalProps) => {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState('');
  const [scanType, setScanType] = useState<ScanType>('port_service');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    listAssets({ organization_id: organizationId, authorized_only: true }, token)
      .then((result) => {
        if (cancelled) return;
        setAssets(result);
        if (result.length > 0) setAssetId(String(result[0].id));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : t('scans.newScanModal.errors.assetsFetch', 'Failed to load authorized assets.'),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [organizationId, token, t]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newScanModalTitle"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="newScanModalTitle"
              className="text-2xl font-bold text-gray-100"
            >
              {t('scans.newScanModal.title', 'New scan')}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {t(
                'scans.newScanModal.subtitle',
                'Queue a scan for an asset with approved authority.',
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Organization (locked) */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="newScanOrganization"
            >
              {t('scans.organization', 'Organization')}
            </label>
            <select
              id="newScanOrganization"
              value={organizationId}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-800/60 px-4 py-2.5 text-gray-400 opacity-80"
            >
              <option value={organizationId}>
                {organizationName ? `${organizationName} (ID: ${organizationId})` : organizationId}
              </option>
            </select>
          </div>

          {/* Asset (authorized only) */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="newScanAsset"
            >
              {t('scans.newScanModal.asset', 'Authorized asset')} *
            </label>
            <select
              id="newScanAsset"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              disabled={isLoading || assets.length === 0}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <option>{t('scans.newScanModal.loadingAssets', 'Loading assets…')}</option>
              )}
              {!isLoading && assets.length === 0 && (
                <option value="">
                  {t('scans.newScanModal.noAuthorizedAssets', 'No authorized assets available')}
                </option>
              )}
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.label ? `${asset.label} (${asset.value})` : asset.value}
                </option>
              ))}
            </select>
            {!isLoading && assets.length === 0 && (
              <p className="mt-2 flex items-start gap-2 text-sm text-amber-300">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {t(
                  'scans.newScanModal.noAuthorizedAssetsHint',
                  'Upload and get an authority document approved before requesting a scan.',
                )}
              </p>
            )}
          </div>

          {/* Scan type */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="newScanType"
            >
              {t('scans.newScanModal.scanType', 'Scan type')}
            </label>
            <select
              id="newScanType"
              value={scanType}
              onChange={(e) => setScanType(e.target.value as ScanType)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-gray-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            >
              {SCAN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled
              title={t('scans.newScanModal.submitComingSoon', 'Running scans is coming soon')}
            >
              {t('scans.newScanModal.submit', 'Run scan')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
