import api from './axios.config';
import type {
  Expediente,
  CreateExpedienteDTO,
  UpdateExpedienteDTO,
  EnviarRevisionDTO,
  AprobarExpedienteDTO,
  RechazarExpedienteDTO,
  ApiResponse,
} from '@/types';

export const expedientesAPI = {
  getAll: async (): Promise<Expediente[]> => {
    const response = await api.get<Expediente[]>('/expedientes');
    return response.data;
  },

  getById: async (id: number): Promise<Expediente> => {
    const response = await api.get<Expediente>(`/expedientes/${id}`);
    return response.data;
  },

  create: async (expedienteData: CreateExpedienteDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/expedientes', expedienteData);
    return response.data;
  },

  update: async (id: number, expedienteData: UpdateExpedienteDTO): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>(`/expedientes/${id}`, expedienteData);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/expedientes/${id}`);
    return response.data;
  },

  enviarRevision: async (id: number, data: EnviarRevisionDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      `/expedientes/${id}/enviar-revision`,
      data
    );
    return response.data;
  },

  aprobar: async (id: number, data: AprobarExpedienteDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/expedientes/${id}/aprobar`, data);
    return response.data;
  },

  rechazar: async (id: number, data: RechazarExpedienteDTO): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/expedientes/${id}/rechazar`, data);
    return response.data;
  },
};
