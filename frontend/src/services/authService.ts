import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{ status: string; data: { user: any; token: string } }>('/api/auth/login', credentials);
    
    // Store tokens in localStorage
    const { user, token } = response.data.data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', token); // Backend doesn't have refresh token yet
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      user,
      accessToken: token,
      refreshToken: token,
    };
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>('/api/auth/refresh', {
      refreshToken,
    });
    
    // Update access token
    localStorage.setItem('accessToken', response.data.accessToken);
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getRole(): 'ADMIN' | 'WAITER' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  },
};

export default authService;
