import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { uploadAuthorityFile } from '../../services/authorityService';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface UploadAuthorityFileModalProps {
  organizationId: number;
  organizationName?: string;
  token: string;
  onClose: () => void;
  onUploaded: () => void;
}

export const UploadAuthorityFileModal = ({
  organizationId,
  organizationName,
  token,
  onClose,
  onUploaded,
}: UploadAuthorityFileModalProps) => {
  const { t: translate } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [domain, setDomain] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const validate = (): string | null => {
    if (!domain.trim()) {
      return translate(
        'authorityUpload.errors.domainRequired',
        'Please enter the domain to review.',
      );
    }
    if (!file) {
      return translate(
        'authorityUpload.errors.fileRequired',
        'Please select an authority file to upload.',
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return translate(
        'authorityUpload.errors.fileType',
        'Unsupported file type. Allowed: PDF, PNG, JPEG, WEBP.',
      );
    }
    if (file.size > MAX_BYTES) {
      return translate(
        'authorityUpload.errors.fileSize',
        'File exceeds the maximum allowed size of 10 MB.',
      );
    }
    if (!consentAccepted) {
      return translate(
        'authorityUpload.errors.consentRequired',
        'You must accept the consent to run tests.',
      );
    }
    if (!termsAccepted) {
      return translate(
        'authorityUpload.errors.termsRequired',
        'You must accept the terms and conditions.',
      );
    }
    return null;
  };

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
      await uploadAuthorityFile(
        {
          organization_id: organizationId,
          file: file as File,
          consent_accepted: consentAccepted,
          terms_accepted: termsAccepted,
          domain: domain.trim(),
        },
        token,
      );
      onUploaded();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : translate('authorityUpload.errors.general', 'Upload failed.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="uploadAuthorityFileModalTitle"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950/95 p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2
              id="uploadAuthorityFileModalTitle"
              className="mt-4 text-2xl font-bold text-gray-100"
            >
              {translate('authorityUpload.title', 'Upload authority file')}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {translate(
                'authorityUpload.subtitle',
                'Upload a document (e.g. an invoice) proving that the domain to be reviewed belongs to you or your company.',
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={translate('common.close', 'Close')}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
          {/* Organization (locked) */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="uploadOrganizationId"
            >
              {translate('authorityUpload.organization', 'Organization')}
            </label>
            <select
              id="uploadOrganizationId"
              value={organizationId}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-800/60 px-4 py-2.5 text-gray-400 opacity-80"
            >
              <option value={organizationId}>
                {organizationName ? `${organizationName} (ID: ${organizationId})` : organizationId}
              </option>
            </select>
          </div>

          {/* Domain */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="domain"
            >
              {translate('authorityUpload.domain', 'Domain to review')} *
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              placeholder="example.com"
              required
            />
          </div>

          {/* File selector */}
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-300"
              htmlFor="authorityFile"
            >
              {translate('authorityUpload.file', 'Authority file (invoice)')} *
            </label>
            <label
              htmlFor="authorityFile"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/60 px-6 py-8 text-center transition-colors hover:border-blue-400/70 hover:bg-gray-900"
            >
              <UploadCloud className="h-8 w-8 text-blue-300" aria-hidden="true" />
              <span className="mt-3 text-sm font-medium text-gray-200">
                {translate('authorityUpload.fileHint', 'Click to select a file')}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {translate(
                  'authorityUpload.fileFormats',
                  'PDF, PNG, JPEG or WEBP · up to 10 MB',
                )}
              </span>
              <input
                id="authorityFile"
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {file && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-200">
                <FileText className="h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span className="truncate">{file.name}</span>
                <span className="ml-auto shrink-0 text-xs text-gray-500">
                  {formatBytes(file.size)}
                </span>
              </div>
            )}
          </div>

          {/* Consent checkbox */}
          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-400/40"
            />
            <span>
              {translate(
                'authorityUpload.consent',
                'I authorize and consent to running tests and scans against the declared domain.',
              )}
            </span>
          </label>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-400/40"
            />
            <span>
              {translate('authorityUpload.termsPrefix', 'I accept the')}{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300"
              >
                {translate('authorityUpload.termsLink', 'terms and conditions')}
              </Link>
              .
            </span>
          </label>

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
              {translate('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading
                ? translate('authorityUpload.uploading', 'Uploading…')
                : translate('authorityUpload.submit', 'Upload file')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
