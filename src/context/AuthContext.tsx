import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ACCESS_TOKEN_KEY,
  REMEMBER_DEVICE_KEY,
  loginUser,
  logoutUser,
} from '../services/authService';
import type { LoginRequest } from '../types/auth';
import { AuthContext, type AuthContextValue } from './AuthContextDefinition';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );

  const syncToken = useCallback(() => {
    setToken(localStorage.getItem(ACCESS_TOKEN_KEY));
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      await loginUser(payload);
      syncToken();
    },
    [syncToken],
  );

  const logout = useCallback(() => {
    logoutUser();
    syncToken();
  }, [syncToken]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === ACCESS_TOKEN_KEY ||
        event.key === REMEMBER_DEVICE_KEY
      ) {
        syncToken();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [login, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
