import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, Download, FileText, XCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useUserOrganizations } from '../../hooks/useUserOrganizations';
import { downloadAuthorityFile, getAuthorityFiles } from '../../services/authorityService';
import type { AuthorityFile, AuthorityFileStatus } from '../../types/authority';
import { UploadAuthorityFileModal } from './UploadAuthorityFileModal';

const STATUS_STYLES: Record<AuthorityFileStatus, string> = {
  pending: 'bg-amber-950/40 border-amber-600 text-amber-400',
  approved: 'bg-green-950/40 border-green-600 text-green-400',
  rejected: 'bg-red-950/40 border-red-600 text-red-400',
};

const STATUS_ICONS: Record<AuthorityFileStatus, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const AuthorityFileUpload = () => {
  const { t: translate } = useTranslation();
  const { token } = useAuth();
  const { organizations, isLoading: organizationsLoading, error: organizationsError } =
    useUserOrganizations(token);

  const [organizationId, setOrganizationId] = useState('');
  const [files, setFiles] = useState<AuthorityFile[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AuthorityFileStatus[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId && organizations.length > 0) {
      setOrganizationId(String(organizations[0].id));
    }
  }, [organizationId, organizations]);

  const fetchFiles = useCallback(() => {
    if (!token || !organizationId) return;

    setIsListLoading(true);
    setListError(null);
    getAuthorityFiles(Number(organizationId), token)
      .then(setFiles)
      .catch((err) => {
        setListError(
          err instanceof Error
            ? err.message
            : translate('authorityUpload.errors.listFetch', 'Failed to load authority files.'),
        );
        setFiles([]);
      })
      .finally(() => setIsListLoading(false));
  }, [organizationId, token, translate]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  const handleUploaded = () => {
    setIsUploadModalOpen(false);
    setRefreshKey((key) => key + 1);
  };

  const handleDownload = async (file: AuthorityFile) => {
    if (!token) return;

    setDownloadError(null);
    setDownloadingId(file.id);
    try {
      const blob = await downloadAuthorityFile(file.id, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : translate('authorityUpload.errors.download', 'Failed to download the file.'),
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const toggleStatusFilter = (status: AuthorityFileStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const visibleFiles = statusFilter.length
    ? files.filter((file) => statusFilter.includes(file.status))
    : files;

  const selectedOrganizationName = organizations.find(
    (organization) => String(organization.id) === organizationId,
  )?.name;

  return (
    <section className="py-12 bg-gray-900 min-h-screen">
      <Container>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                {translate('authorityUpload.listTitle', 'Authority Files')}
              </h1>
              <p className="mt-2 text-gray-400">
                {translate('authorityUpload.total', 'Total')}:{' '}
                <span className="font-semibold text-gray-200">{files.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="primary"
                disabled={!organizationId}
                onClick={() => setIsUploadModalOpen(true)}
              >
                {translate('authorityUpload.uploadButton', 'Upload authority file')}
              </Button>
              <Button onClick={() => setRefreshKey((key) => key + 1)} disabled={isListLoading}>
                {isListLoading
                  ? translate('common.loading', 'Loading...')
                  : translate('common.refresh', 'Refresh')}
              </Button>
            </div>
          </div>

          {/* Organization (locked) */}
          <div className="max-w-md">
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="authorityFilesOrganization"
            >
              {translate('authorityUpload.organization', 'Organization')}
            </label>
            <select
              id="authorityFilesOrganization"
              value={organizationId}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-800/60 px-4 py-2.5 text-gray-400 opacity-80"
            >
              {organizationsLoading && (
                <option>{translate('common.loading', 'Loading...')}</option>
              )}
              {!organizationsLoading && organizations.length === 0 && (
                <option value="">
                  {translate('authorityUpload.noOrganizations', 'No organizations available')}
                </option>
              )}
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name} (ID: {organization.id})
                </option>
              ))}
            </select>
            {organizationsError && (
              <p className="mt-1 text-sm text-red-300">{organizationsError}</p>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['pending', 'approved', 'rejected'] as AuthorityFileStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  statusFilter.includes(status)
                    ? 'bg-gray-700 border-blue-500 text-blue-400'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {translate(`authorityUpload.status.${status}`, status)}
              </button>
            ))}
          </div>

          {listError && (
            <div className="bg-red-950/40 border border-red-600 rounded-lg p-4">
              <p className="text-red-200">{listError}</p>
            </div>
          )}

          {downloadError && (
            <div className="bg-red-950/40 border border-red-600 rounded-lg p-4">
              <p className="text-red-200">{downloadError}</p>
            </div>
          )}

          {isListLoading && !files.length && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-400"></div>
              <p className="mt-4 text-gray-400">
                {translate('authorityUpload.loadingFiles', 'Loading authority files...')}
              </p>
            </div>
          )}

          {!isListLoading && visibleFiles.length === 0 && !listError && (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">
                {translate('authorityUpload.noFiles', 'No authority files found')}
              </p>
            </div>
          )}

          {visibleFiles.length > 0 && (
            <div className="space-y-4">
              {visibleFiles.map((file) => {
                const StatusIcon = STATUS_ICONS[file.status];
                return (
                  <Card
                    key={file.id}
                    className="p-6 bg-gray-800 border-gray-700 hover:shadow-xl transition-shadow shadow-black/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100">
                            {file.domain || `${translate('authorityUpload.asset', 'Asset')} ${file.asset_id}`}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                            {file.filename} · {formatBytes(file.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[file.status]}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {translate(`authorityUpload.status.${file.status}`, file.status)}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownload(file)}
                          disabled={downloadingId === file.id}
                          className="inline-flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          {downloadingId === file.id
                            ? translate('authorityUpload.downloading', 'Downloading…')
                            : translate('authorityUpload.download', 'Download')}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {translate('authorityUpload.fields.uploaded', 'Uploaded')}
                        </p>
                        <p className="font-medium text-gray-200">
                          {new Date(file.created_at).toLocaleString()}
                        </p>
                      </div>
                      {file.verified_at && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {translate('authorityUpload.fields.reviewed', 'Reviewed')}
                          </p>
                          <p className="font-medium text-gray-200">
                            {new Date(file.verified_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {file.status === 'rejected' && file.review_note && (
                      <div className="mt-4 p-4 bg-red-950/40 border border-red-600 rounded-lg">
                        <span className="font-bold text-red-100 text-sm block mb-1 uppercase tracking-tight">
                          {translate('authorityUpload.fields.reviewNote', 'Review note')}
                        </span>
                        <p className="text-sm text-red-200 leading-relaxed">{file.review_note}</p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Container>

      {isUploadModalOpen && token && organizationId && (
        <UploadAuthorityFileModal
          organizationId={Number(organizationId)}
          organizationName={selectedOrganizationName}
          token={token}
          onClose={() => setIsUploadModalOpen(false)}
          onUploaded={handleUploaded}
        />
      )}
    </section>
  );
};
