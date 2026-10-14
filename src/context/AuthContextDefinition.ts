import { createContext } from 'react';
import type { LoginRequest } from '../types/auth';

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
