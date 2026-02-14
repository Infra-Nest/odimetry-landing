import type { CreateUserRequest } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

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
