// Tipos base
export interface BaseEntity {
  CreatedAt: string;
  UpdatedAt: string;
}

// Roles
export interface Rol extends BaseEntity {
  IdRol: number;
  RoleName: string;
  Description: string;
  IsActive: boolean;
}

export const RoleEnum = {
  TECNICO: 1,
  COORDINADOR: 2,
} as const;

export type RoleEnum = typeof RoleEnum[keyof typeof RoleEnum];

// Estados de Expediente
export interface EstadoExpediente extends BaseEntity {
  IdEstado: number;
  StateName: string;
  Description: string;
  IsActive: boolean;
}

export const EstadoExpedienteEnum = {
  REGISTRANDO: 1,
  EN_REVISION: 2,
  APROBADO: 3,
  RECHAZADO: 4,
} as const;

export type EstadoExpedienteEnum = typeof EstadoExpedienteEnum[keyof typeof EstadoExpedienteEnum];

// Usuario
export interface Usuario extends BaseEntity {
  IdUsuario: number;
  Username: string;
  FullName: string;
  IdRol: number;
  RoleName: string;
  IsActive: boolean;
}

export interface LoginCredentials {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  message: string;
  user: Usuario;
}

// Expediente
export interface Expediente extends BaseEntity {
  IdExpediente: number;
  FileNumber: string;
  Description: string;
  IdTecnicoRegistro: number;
  TecnicoRegistro: string;
  IdEstado: number;
  StateName: string;
  ObservacionesExpediente?: string | null;
  IdCoordinadorRevision?: number | null;
  CoordinadorRevision?: string | null;
  ReviewDate?: string | null;
}

export interface CreateExpedienteDTO {
  FileNumber: string;
  Description: string;
  IdTecnicoRegistro: number;
  IdEstado: number;
}

export interface UpdateExpedienteDTO {
  FileNumber: string;
  Description: string;
  IdEstado: number;
  ObservacionesExpediente?: string | null;
  IdCoordinadorRevision?: number | null;
  ReviewDate?: string | null;
}

export interface EnviarRevisionDTO {
  IdCoordinadorRevision: number;
}

export interface AprobarExpedienteDTO {
  IdCoordinadorRevision: number;
}

export interface RechazarExpedienteDTO {
  IdCoordinadorRevision: number;
  ObservacionesExpediente: string;
}

// Indicio
export interface Indicio extends BaseEntity {
  IdIndicio: number;
  IdExpediente: number;
  Description: string;
  Color?: string | null;
  Size?: string | null;
  Weight?: string | null;
  Location: string;
  IdTecnicoRegistro: number;
  TecnicoRegistro: string;
}

export interface CreateIndicioDTO {
  IdExpediente: number;
  Description: string;
  Color?: string;
  Size?: string;
  Weight?: string;
  Location: string;
  IdTecnicoRegistro: number;
}

export interface UpdateIndicioDTO {
  Description: string;
  Color?: string;
  Size?: string;
  Weight?: string;
  Location: string;
}

// Reportes
export interface ReporteExpediente {
  IdExpediente: number;
  FileNumber: string;
  Description: string;
  StateName: string;
  TecnicoRegistro: string;
  CoordinadorRevision?: string;
  CreatedAt: string;
  ReviewDate?: string;
}

export interface EstadisticasPorEstado {
  StateName: string;
  Cantidad: number;
  Porcentaje: number;
}

export interface TotalesEstadisticas {
  TotalExpedientes: number;
  TotalIndicios: number;
  TotalUsuariosActivos: number;
}

export interface EstadisticasGenerales {
  estadisticasPorEstado: EstadisticasPorEstado[];
  totales: TotalesEstadisticas;
}

export interface ReporteTecnico {
  IdUsuario: number;
  FullName: string;
  TotalExpedientes: number;
  TotalIndicios: number;
  ExpedientesAprobados: number;
  ExpedientesRechazados: number;
}

export interface ReporteCoordinador {
  IdUsuario: number;
  FullName: string;
  TotalRevisiones: number;
  TotalAprobados: number;
  TotalRechazados: number;
}

export interface FiltrosReporte {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Form Types
export interface ExpedienteFormData {
  FileNumber: string;
  Description: string;
  IdTecnicoRegistro: number;
}

export interface IndicioFormData {
  Description: string;
  Color?: string;
  Size?: string;
  Weight?: string;
  Location: string;
  IdTecnicoRegistro: number;
}

export interface LoginFormData {
  Username: string;
  Password: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Table Types
export interface TableColumn<T = any> {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

// Select Option Type
export interface SelectOption {
  value: string | number;
  label: string;
}

// Estado Formatting
export interface EstadoFormat {
  text: string;
  color: string;
}
