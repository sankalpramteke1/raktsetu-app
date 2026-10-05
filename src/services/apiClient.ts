import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'raktsetu_auth_token';
const USER_KEY = 'raktsetu_user_data';

// Determine the best default host for development
// On web: localhost:4000
// On Android emulator: 10.0.2.2:4000
// On physical mobile device on LAN: 10.50.28.218:4000
const getDefaultApiHost = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:4000/api';
  }
  // Mobile device/emulator default LAN address
  return 'http://10.50.28.218:4000/api';
};

export const API_BASE_URL = getDefaultApiHost();

// Cross-platform safe storage helpers
export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('Storage getItem error:', e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn('Storage setItem error:', e);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('Storage removeItem error:', e);
    }
  },
};

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'staff' | string;
  phone?: string;
  status?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authStorage = {
  async getToken(): Promise<string | null> {
    return storage.getItem(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    await storage.setItem(TOKEN_KEY, token);
  },
  async getUser(): Promise<AuthUser | null> {
    const raw = await storage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async setUser(user: AuthUser): Promise<void> {
    await storage.setItem(USER_KEY, JSON.stringify(user));
  },
  async clearAuth(): Promise<void> {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);
  },
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        json?.error ||
        json?.message ||
        `Request failed with status ${response.status} (${response.statusText})`;
      const err = new Error(errorMsg) as Error & { status?: number; data?: any };
      err.status = response.status;
      err.data = json;
      throw err;
    }

    return json as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Server request timed out. Please check your network and backend status.');
    }
    throw err;
  }
}
