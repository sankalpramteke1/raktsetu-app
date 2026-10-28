import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, subscribeToAuthErrors } from '../services/apiClient';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      const session = await authService.getStoredSession();
      if (session.token) {
        // Verify token validity with backend first
        try {
          const freshUser = await authService.getMe();
          setToken(session.token);
          setUser(freshUser);
        } catch (err: any) {
          // If token is expired, invalid or access denied, clear credentials
          if (
            err?.status === 401 ||
            err?.status === 403 ||
            err?.message?.toLowerCase().includes('denied') ||
            err?.message?.toLowerCase().includes('expired') ||
            err?.message?.toLowerCase().includes('invalid')
          ) {
            console.warn('Stored session expired or invalid on launch; logging out.');
            await authService.logout().catch(() => {});
            setToken(null);
            setUser(null);
          } else {
            // Offline or temporary network glitch: fallback to stored user session
            setToken(session.token);
            setUser(session.user);
          }
        }
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.warn('Auth initialization error:', e);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    // Listen for 401/403 session expirations triggered by any service request
    const unsubscribe = subscribeToAuthErrors(() => {
      setToken(null);
      setUser(null);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
