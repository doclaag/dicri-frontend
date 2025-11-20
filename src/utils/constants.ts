import { RoleEnum, EstadoExpedienteEnum } from '@/types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROLES = {
  TECNICO: RoleEnum.TECNICO,
  COORDINADOR: RoleEnum.COORDINADOR,
} as const;

export const ESTADOS_EXPEDIENTE = {
  REGISTRANDO: EstadoExpedienteEnum.REGISTRANDO,
  EN_REVISION: EstadoExpedienteEnum.EN_REVISION,
  APROBADO: EstadoExpedienteEnum.APROBADO,
  RECHAZADO: EstadoExpedienteEnum.RECHAZADO,
} as const;

export const ESTADOS_NOMBRES: Record<number, string> = {
  1: 'Registrando',
  2: 'En Revisión',
  3: 'Aprobado',
  4: 'Rechazado',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  EXPEDIENTES: '/expedientes',
  EXPEDIENTE_DETAIL: '/expedientes/:id',
  CREATE_EXPEDIENTE: '/expedientes/nuevo',
  INDICIOS: '/expedientes/:id/indicios',
  REVISION: '/revision',
  REPORTES: '/reportes',
} as const;

export const PERMISSIONS = {
  CREATE_EXPEDIENTE: 'create_expediente',
  EDIT_EXPEDIENTE: 'edit_expediente',
  DELETE_EXPEDIENTE: 'delete_expediente',
  REVIEW_EXPEDIENTE: 'review_expediente',
  CREATE_INDICIO: 'create_indicio',
  VIEW_REPORTES: 'view_reportes',
} as const;
