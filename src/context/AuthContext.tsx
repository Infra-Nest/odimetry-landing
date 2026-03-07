import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ACCESS_TOKEN_KEY,
  REMEMBER_DEVICE_KEY,
  getAuthToken,
  loginUser,
  logoutUser,
} from '../services/authService';
import type { LoginRequest } from '../types/auth';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    getAuthToken(),
  );

  const syncToken = useCallback(() => {
    setToken(getAuthToken());
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      await loginUser(payload);
      syncToken();
      
      // Aplicar la organización por defecto después del login
      try {
        const { applyDefaultOrganization } = await import('../utils/appSettings');
        await applyDefaultOrganization();
      } catch (error) {
        console.error('Failed to apply default organization after login:', error);
      }
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
