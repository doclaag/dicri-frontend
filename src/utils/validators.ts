import type {
  ValidationResult,
  ExpedienteFormData,
  IndicioFormData,
  LoginFormData,
} from '@/types';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value && value.length <= maxLength;
};

export const validateFileNumber = (fileNumber: string): boolean => {
  return validateRequired(fileNumber) && validateMinLength(fileNumber, 3);
};

export const validateExpedienteForm = (formData: ExpedienteFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateRequired(formData.FileNumber)) {
    errors.FileNumber = 'El número de expediente es requerido';
  }

  if (!validateRequired(formData.Description)) {
    errors.Description = 'La descripción es requerida';
  }

  if (!validateRequired(formData.IdTecnicoRegistro)) {
    errors.IdTecnicoRegistro = 'El técnico es requerido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateIndicioForm = (formData: IndicioFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateRequired(formData.Description)) {
    errors.Description = 'La descripción es requerida';
  }

  if (!validateRequired(formData.Location)) {
    errors.Location = 'La ubicación es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (formData: LoginFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateRequired(formData.Username)) {
    errors.Username = 'El usuario es requerido';
  }

  if (!validateRequired(formData.Password)) {
    errors.Password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
