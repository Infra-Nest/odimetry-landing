import type { CreateUserRequest, LoginRequest } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function loginUser(payload: LoginRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error('Login error response:', data);
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Login failed'
    );
  }

  // Store token if provided
  if (data?.access_token) {
    localStorage.setItem('access_token', data.access_token);
    console.log('✅ Access token stored');
  }

  // Store user_id 
  if (data?.user_id) {
    localStorage.setItem('user_id', data.user_id);
    console.log('✅ User ID stored:', data.user_id);
  } else if (data?.user?.id) {
    localStorage.setItem('user_id', data.user.id);
    console.log('✅ User ID stored from user object:', data.user.id);
  } else {
    console.warn('⚠️ No user_id in login response');
  }

  // Store organization_id - try multiple locations
  let orgId: string | null = null;
  
  // Try selected_organization first
  if (data?.selected_organization?.organization_id) {
    orgId = data.selected_organization.organization_id;
    console.log('✅ Organization ID found in selected_organization:', orgId);
  }
  // Try first organization in organizations array (with id field)
  else if (data?.organizations && Array.isArray(data.organizations) && data.organizations.length > 0) {
    orgId = data.organizations[0].organization_id || data.organizations[0].id;
    console.log('✅ Organization ID found in organizations array:', orgId);
  }
  // Try organization_id at root level
  else if (data?.organization_id) {
    orgId = data.organization_id;
    console.log('✅ Organization ID found at root level:', orgId);
  }
  
  if (orgId) {
    localStorage.setItem('organization_id', orgId);
    console.log('💾 Organization ID saved to localStorage:', orgId);
  } else {
    console.error('❌ Organization ID not found in any expected location');
    console.error('📦 Full response structure:', JSON.stringify(data, null, 2));
  }

  console.log('📦 Login response structure:', {
    hasAccessToken: !!data?.access_token,
    hasUser: !!data?.user,
    hasUserId: !!data?.user_id,
    hasSelectedOrg: !!data?.selected_organization,
    orgsCount: data?.organizations?.length || 0,
  });

  // Store remember device preference
  if (payload.rememberDevice) {
    localStorage.setItem('rememberDevice', 'true');
  }
}

export async function createUser(payload: CreateUserRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error('Signup error response:', data);
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Signup failed'
    );
  }
}
