import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { EstadoFormat } from '@/types';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return '-';
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
  } catch (error) {
    return '-';
  }
};

export const formatDateTimeShort = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), "dd/MM/yy HH:mm", { locale: es });
  } catch (error) {
    return '-';
  }
};

export const formatEstado = (estadoId: number): EstadoFormat => {
  const estados: Record<number, EstadoFormat> = {
    1: { text: 'Registrando', color: 'bg-yellow-100 text-yellow-800' },
    2: { text: 'En Revisión', color: 'bg-blue-100 text-blue-800' },
    3: { text: 'Aprobado', color: 'bg-green-100 text-green-800' },
    4: { text: 'Rechazado', color: 'bg-red-100 text-red-800' },
  };
  return estados[estadoId] || { text: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
};

export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
