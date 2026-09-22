import type { CreateUserRequest, LoginRequest } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
export const ACCESS_TOKEN_KEY = 'access_token';
export const REMEMBER_DEVICE_KEY = 'rememberDevice';
const DEV_FAKE_ACCESS_TOKEN = 'dev-fake-access-token';

export const IS_FAKE_LOGIN_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_FAKE_LOGIN === 'true';

export const FAKE_LOGIN_CREDENTIALS = {
  email: (import.meta.env.VITE_FAKE_LOGIN_EMAIL ?? 'info@infranest.es').toLowerCase(),
  password: import.meta.env.VITE_FAKE_LOGIN_PASSWORD ?? 'odimetry-demo',
} as const;

function persistSession(token: string, rememberDevice?: boolean): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  if (rememberDevice) {
    localStorage.setItem(REMEMBER_DEVICE_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_DEVICE_KEY);
  }
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
    console.error('Login error response:', data);
    throw new Error(
      data?.detail
        ? JSON.stringify(data.detail, null, 2)
        : 'Login failed'
    );
  }

  // Store token if provided
  if (data?.access_token) {
    persistSession(data.access_token, payload.rememberDevice);
    return;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_DEVICE_KEY);
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
