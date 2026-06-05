import { apiClient } from './client';
import { AuthTokens, User } from '@/types';

interface RegisterInput { email: string; password: string; name: string }
interface LoginInput { email: string; password: string }

export const authApi = {
  register: (data: RegisterInput) =>
    apiClient.post<{ success: boolean; data: AuthTokens }>('/auth/register', data).then((r) => r.data.data!),

  login: (data: LoginInput) =>
    apiClient.post<{ success: boolean; data: AuthTokens }>('/auth/login', data).then((r) => r.data.data!),

  logout: () => apiClient.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh', { refreshToken }).then((r) => r.data.data!),

  getMe: () =>
    apiClient.get<{ success: boolean; data: User }>('/auth/me').then((r) => r.data.data!),
};
