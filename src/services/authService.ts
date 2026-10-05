import { apiRequest, authStorage, AuthUser, LoginResponse } from './apiClient';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (data.token) {
      await authStorage.setToken(data.token);
      await authStorage.setUser(data.user);
    }
    return data;
  },

  async getMe(): Promise<AuthUser> {
    const data = await apiRequest<{ user: AuthUser }>('/auth/me', {
      method: 'GET',
    });
    if (data.user) {
      await authStorage.setUser(data.user);
    }
    return data.user;
  },

  async logout(): Promise<void> {
    await authStorage.clearAuth();
  },

  async getStoredSession(): Promise<{ token: string | null; user: AuthUser | null }> {
    const [token, user] = await Promise.all([
      authStorage.getToken(),
      authStorage.getUser(),
    ]);
    return { token, user };
  },
};
