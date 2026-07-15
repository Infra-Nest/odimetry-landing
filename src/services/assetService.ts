import type { Asset, AssetListFilters } from '../types/asset';
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

export async function listAssets(
  filters: AssetListFilters,
  token: string,
): Promise<Asset[]> {
  const params = new URLSearchParams();
  params.append('organization_id', String(filters.organization_id));
  if (filters.client_id != null) params.append('client_id', String(filters.client_id));
  if (filters.authorized_only != null) {
    params.append('authorized_only', String(filters.authorized_only));
  }
  if (filters.limit != null) params.append('limit', String(filters.limit));
  if (filters.offset != null) params.append('offset', String(filters.offset));

  const res = await fetch(`${API_BASE}/assets?${params.toString()}`, {
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
    throw new Error(parseError(data, 'Failed to fetch assets'));
  }

  return data as Asset[];
}
