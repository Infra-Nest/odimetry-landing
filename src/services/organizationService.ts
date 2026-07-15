import type { UserOrganization } from '../types/organization';
import { notifySessionExpired } from './authService';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function getMyOrganizations(
  token: string,
): Promise<UserOrganization[]> {
  const res = await fetch(`${API_BASE}/users/me/organizations`, {
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
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? (data as { detail: unknown }).detail
        : null;
    throw new Error(
      typeof detail === 'string' ? detail : 'Failed to load organizations',
    );
  }

  return data as UserOrganization[];
}
