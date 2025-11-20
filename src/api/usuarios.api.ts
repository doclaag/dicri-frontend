import api from './axios.config';
import type { Usuario, ApiResponse } from '@/types';

export const usuariosAPI = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  create: async (usuarioData: Partial<Usuario>): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/usuarios', usuarioData);
    return response.data;
  },

  update: async (id: number, usuarioData: Partial<Usuario>): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/usuarios/${id}`);
    return response.data;
  },

  getTecnicos: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data.filter((user) => user.IdRol === 1);
  },

  getCoordinadores: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data.filter((user) => user.IdRol === 2);
  },
};
