import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import { clearToken, getToken } from '../api/client';

const USERNAME_KEY = 'workout_logger_username';

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_KEY),
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());

  const login = useCallback(async (username: string, password: string) => {
    await authApi.login({ username, password });
    localStorage.setItem(USERNAME_KEY, username);
    setUsername(username);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    await authApi.register({ username, password });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(USERNAME_KEY);
    setUsername(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
