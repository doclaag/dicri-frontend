import api from './axios.config';
import type {
  Indicio,
  CreateIndicioDTO,
  UpdateIndicioDTO,
  ApiResponse,
} from '@/types';

export const indiciosAPI = {
  getAll: async (): Promise<Indicio[]> => {
    const response = await api.get<Indicio[]>('/indicios');
    return response.data;
  },

  getById: async (id: number): Promise<Indicio> => {
    const response = await api.get<Indicio>(`/indicios/${id}`);
    return response.data;
  },

  getByExpediente: async (idExpediente: number): Promise<Indicio[]> => {
    const response = await api.get<Indicio[]>(`/expedientes/${idExpediente}/indicios`);
    return response.data;
  },

  create: async (indicioData: CreateIndicioDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/indicios', indicioData);
    return response.data;
  },

  update: async (id: number, indicioData: UpdateIndicioDTO): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>(`/indicios/${id}`, indicioData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/indicios/${id}`);
    return response.data;
  },
};
