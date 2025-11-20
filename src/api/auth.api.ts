import api from './axios.config';
import type { LoginCredentials, LoginResponse, Usuario } from '@/types';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): Usuario | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  saveUser: (userData: Usuario): void => {
    localStorage.setItem('user', JSON.stringify(userData));
  },
};
