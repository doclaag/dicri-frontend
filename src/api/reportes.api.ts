import api from './axios.config';
import type {
  ReporteExpediente,
  EstadisticasGenerales,
  ReporteTecnico,
  ReporteCoordinador,
  FiltrosReporte,
} from '@/types';

export const reportesAPI = {
  getReporteExpedientes: async (filters: FiltrosReporte = {}): Promise<ReporteExpediente[]> => {
    const params = new URLSearchParams();
    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters.estado) params.append('estado', filters.estado.toString());

    const response = await api.get<ReporteExpediente[]>(
      `/reportes/expedientes?${params.toString()}`
    );
    return response.data;
  },

  getEstadisticas: async (filters: FiltrosReporte = {}): Promise<EstadisticasGenerales> => {
    const params = new URLSearchParams();
    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);

    const response = await api.get<EstadisticasGenerales>(
      `/reportes/estadisticas?${params.toString()}`
    );
    return response.data;
  },

  getReporteTecnicos: async (): Promise<ReporteTecnico[]> => {
    const response = await api.get<ReporteTecnico[]>('/reportes/tecnicos');
    return response.data;
  },

  getReporteCoordinadores: async (): Promise<ReporteCoordinador[]> => {
    const response = await api.get<ReporteCoordinador[]>('/reportes/coordinadores');
    return response.data;
  },
};
