import type { CreateUserRequest, LoginRequest } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const REMEMBER_DEVICE_KEY = 'rememberDevice';
export const SESSION_STARTED_AT_KEY = 'session_started_at';
export const LAST_REFRESH_AT_KEY = 'last_refresh_at';
const DEV_FAKE_ACCESS_TOKEN = 'dev-fake-access-token';

const SESSION_MAX_AGE_MS = Number(import.meta.env.VITE_SESSION_MAX_AGE_MS ?? 1000 * 60 * 60 * 12);
const REFRESH_MIN_INTERVAL_MS = Number(import.meta.env.VITE_REFRESH_MIN_INTERVAL_MS ?? 30_000);
const AUTH_REFRESH_MODE = String(import.meta.env.VITE_AUTH_REFRESH_MODE ?? 'hybrid').toLowerCase();

export const IS_FAKE_LOGIN_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_FAKE_LOGIN === 'true';

export const FAKE_LOGIN_CREDENTIALS = {
  email: (import.meta.env.VITE_FAKE_LOGIN_EMAIL ?? 'demo@odimetry.local').toLowerCase(),
  password: import.meta.env.VITE_FAKE_LOGIN_PASSWORD ?? 'odimetry-demo',
} as const;

function persistSession(token: string, rememberDevice?: boolean): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(SESSION_STARTED_AT_KEY, Date.now().toString());

  if (rememberDevice) {
    localStorage.setItem(REMEMBER_DEVICE_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_DEVICE_KEY);
  }
}

export function isAbsoluteSessionExpired(): boolean {
  const startedAtRaw = localStorage.getItem(SESSION_STARTED_AT_KEY);
  if (!startedAtRaw) {
    return false;
  }

  const startedAt = Number(startedAtRaw);
  if (!Number.isFinite(startedAt)) {
    return false;
  }

  return Date.now() - startedAt > SESSION_MAX_AGE_MS;
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return null;
  }

  if (isAbsoluteSessionExpired()) {
    logoutUser();
    return null;
  }

  return token;
}

function canAttemptRefreshNow(): boolean {
  const lastRefreshRaw = localStorage.getItem(LAST_REFRESH_AT_KEY);
  if (!lastRefreshRaw) {
    return true;
  }

  const lastRefresh = Number(lastRefreshRaw);
  if (!Number.isFinite(lastRefresh)) {
    return true;
  }

  return Date.now() - lastRefresh >= REFRESH_MIN_INTERVAL_MS;
}

export async function loginUser(payload: LoginRequest): Promise<void> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (
    IS_FAKE_LOGIN_ENABLED &&
    normalizedEmail === FAKE_LOGIN_CREDENTIALS.email &&
    payload.password === FAKE_LOGIN_CREDENTIALS.password
  ) {
    persistSession(DEV_FAKE_ACCESS_TOKEN, payload.rememberDevice);
    return;
  }

  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, email: normalizedEmail }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Login failed'
    );
  }

  // Store tokens if provided
  if (data?.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  }

  if (data?.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }

  // Store user_id 
  if (data?.user_id) {
    localStorage.setItem('user_id', data.user_id);
  } else if (data?.user?.id) {
    localStorage.setItem('user_id', data.user.id);
  }

  // Store organization_id - try multiple locations
  let orgId: string | null = null;
  
  // Try selected_organization first
  if (data?.selected_organization?.organization_id) {
    orgId = data.selected_organization.organization_id;
  }
  // Try first organization in organizations array (with id field)
  else if (data?.organizations && Array.isArray(data.organizations) && data.organizations.length > 0) {
    orgId = data.organizations[0].organization_id || data.organizations[0].id;
  }
  // Try organization_id at root level
  else if (data?.organization_id) {
    orgId = data.organization_id;
  }
  
  if (orgId) {
    localStorage.setItem('organization_id', orgId);
  }

  // Store remember device preference
  if (payload.rememberDevice) {
    localStorage.setItem('rememberDevice', 'true');
  }

  localStorage.setItem(SESSION_STARTED_AT_KEY, Date.now().toString());
  localStorage.removeItem(LAST_REFRESH_AT_KEY);
}

export async function createUser(payload: CreateUserRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Signup failed'
    );
  }
}

export function logoutUser(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('user_id');
  localStorage.removeItem('organization_id');
  localStorage.removeItem(REMEMBER_DEVICE_KEY);
  localStorage.removeItem(SESSION_STARTED_AT_KEY);
  localStorage.removeItem(LAST_REFRESH_AT_KEY);
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (isAbsoluteSessionExpired()) {
    logoutUser();
    return false;
  }

  if (!canAttemptRefreshNow()) {
    return false;
  }

  const requiresLocalRefreshToken = AUTH_REFRESH_MODE === 'localstorage';
  
  if (requiresLocalRefreshToken && !refreshToken) {
    return false;
  }

  try {
    const shouldSendBodyToken = AUTH_REFRESH_MODE !== 'cookie' && Boolean(refreshToken);
    const res = await fetch(`${API_BASE}/users/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: shouldSendBodyToken ? JSON.stringify({ refresh_token: refreshToken }) : JSON.stringify({}),
    });

    if (!res.ok) {
      logoutUser();
      return false;
    }

    const data = await res.json();
    localStorage.setItem(LAST_REFRESH_AT_KEY, Date.now().toString());
    
    if (data?.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    }
    
    if (data?.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }

    return true;
  } catch {
    return false;
  }
}
