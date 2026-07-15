import type {
  AuthorityFile,
  UploadAuthorityFileRequest,
} from '../types/authority';
import { notifySessionExpired } from './authService';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function parseError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    return JSON.stringify(detail, null, 2);
  }
  return fallback;
}

export async function uploadAuthorityFile(
  payload: UploadAuthorityFileRequest,
  token: string,
): Promise<AuthorityFile> {
  const formData = new FormData();
  formData.append('organization_id', String(payload.organization_id));
  formData.append('consent_accepted', String(payload.consent_accepted));
  formData.append('terms_accepted', String(payload.terms_accepted));
  formData.append('file', payload.file);

  if (payload.client_id != null) {
    formData.append('client_id', String(payload.client_id));
  }
  if (payload.asset_id != null) {
    formData.append('asset_id', String(payload.asset_id));
  }
  if (payload.domain) {
    formData.append('domain', payload.domain);
  }

  // NOTE: do not set Content-Type manually; the browser sets the multipart
  // boundary automatically for FormData bodies.
  const res = await fetch(`${API_BASE}/authority-files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    notifySessionExpired();
  }

  if (!res.ok) {
    throw new Error(parseError(data, 'Failed to upload authority file'));
  }

  return data as AuthorityFile;
}

export async function getAuthorityFiles(
  organizationId: number,
  token: string,
): Promise<AuthorityFile[]> {
  const params = new URLSearchParams({
    organization_id: String(organizationId),
  });

  const res = await fetch(`${API_BASE}/authority-files?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    notifySessionExpired();
  }

  if (!res.ok) {
    throw new Error(parseError(data, 'Failed to load authority files'));
  }

  return data as AuthorityFile[];
}

export async function downloadAuthorityFile(
  authorityFileId: number,
  token: string,
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/authority-files/${authorityFileId}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    notifySessionExpired();
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(parseError(data, 'Failed to download authority file'));
  }

  return res.blob();
}
