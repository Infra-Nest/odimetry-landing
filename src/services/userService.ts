import type { User, UserOrganization } from '../types/user';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

export async function getCurrentUser(): Promise<User> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to fetch user profile');
  }

  return res.json();
}

export async function getUserOrganizations(): Promise<UserOrganization[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${API_BASE}/users/me/organizations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to fetch organizations');
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((org) => {
      const organizationId = String(org?.organization_id ?? org?.id ?? '');

      if (!organizationId) {
        return null;
      }

      return {
        organization_id: organizationId,
        name: String(org?.name ?? ''),
        org_type: org?.org_type === 'business' ? 'business' : 'personal',
        role: org?.role ? String(org.role) : undefined,
      } as UserOrganization;
    })
    .filter((org): org is UserOrganization => org !== null);
}

export async function switchOrganization(organizationId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${API_BASE}/users/me/switch-organization`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ organization_id: organizationId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to switch organization');
  }

  // Update localStorage with new organization
  localStorage.setItem('organization_id', organizationId);
  console.log('✅ Switched to organization:', organizationId);
}
