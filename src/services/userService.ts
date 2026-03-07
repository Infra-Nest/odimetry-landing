import type { User, UserOrganization } from '../types/user';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function getCurrentUser(): Promise<User> {
  const res = await fetchWithAuth(`${API_BASE}/users/me`, {
    method: 'GET',
    headers: {
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
  console.log('📡 Calling API:', `${API_BASE}/users/me/organizations`);

  const res = await fetchWithAuth(`${API_BASE}/users/me/organizations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('📡 API Response status:', res.status);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.error('❌ API Error:', data);
    throw new Error(data?.detail || 'Failed to fetch organizations');
  }

  const data = await res.json();
  console.log('📦 Raw API data:', data);

  if (!Array.isArray(data)) {
    console.warn('⚠️ API did not return an array:', typeof data);
    return [];
  }

  const processed = data
    .map((org) => {
      const organizationId = String(org?.organization_id ?? org?.id ?? '');

      if (!organizationId) {
        console.warn('⚠️ Skipping org without ID:', org);
        return null;
      }

      const processed = {
        organization_id: organizationId,
        name: String(org?.name ?? ''),
        org_type: org?.org_type === 'business' ? 'business' : 'personal',
        role: org?.role ? String(org.role) : undefined,
      } as UserOrganization;

      console.log('✅ Processed org:', processed);
      return processed;
    })
    .filter((org): org is UserOrganization => org !== null);

  console.log('📋 Final organizations:', processed);
  return processed;
}

export async function switchOrganization(organizationId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/users/me/switch-organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ organization_id: organizationId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to switch organization');
  }

  localStorage.setItem('organization_id', organizationId);
  console.log('✅ Switched to organization:', organizationId);
}

  export async function updateUserProfile(updates: Partial<User>): Promise<User> {
    console.log('📡 Updating user profile:', updates);

    const res = await fetchWithAuth(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.error('❌ Failed to update profile:', data);
      throw new Error(data?.detail || 'Failed to update user profile');
    }

    const updatedUser = await res.json();
    console.log('✅ Profile updated:', updatedUser);
    return updatedUser;
  }
