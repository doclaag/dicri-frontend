import { useState, useEffect } from 'react';
import { expedientesAPI } from '@/api/expedientes.api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import type { Expediente, CreateExpedienteDTO } from '@/types';

interface UseExpedientesReturn {
  expedientes: Expediente[];
  loading: boolean;
  error: string | null;
  fetchExpedientes: () => Promise<void>;
  createExpediente: (data: CreateExpedienteDTO) => Promise<{ success: boolean; error?: string }>;
  updateExpediente: (id: number, data: any) => Promise<{ success: boolean; error?: string }>;
  deleteExpediente: (id: number) => Promise<{ success: boolean; error?: string }>;
  enviarRevision: (id: number, idCoordinador: number) => Promise<{ success: boolean; error?: string }>;
  aprobarExpediente: (id: number, idCoordinador: number) => Promise<{ success: boolean; error?: string }>;
  rechazarExpediente: (id: number, idCoordinador: number, observaciones: string) => Promise<{ success: boolean; error?: string }>;
}

export const useExpedientes = (): UseExpedientesReturn => {
  const { user, isTecnico, isCoordinador } = useAuth();
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpedientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expedientesAPI.getAll();

      const expedientesFiltrados = data.filter((exp) => {
        if (isTecnico()) {
          return exp.IdTecnicoRegistro === user?.IdUsuario;
        } else if (isCoordinador()) {
          return exp.IdCoordinadorRevision === user?.IdUsuario ||
            (exp.IdEstado === 2 && !exp.IdCoordinadorRevision);
        }
        return false;
      });

      setExpedientes(expedientesFiltrados);
    } catch (err: any) {
      setError(err.message);
      toast.error('Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpedientes();
    }
  }, [user]);


  const createExpediente = async (expedienteData: CreateExpedienteDTO) => {
    try {
      await expedientesAPI.create(expedienteData);
      toast.success('Expediente creado exitosamente');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear expediente');
      return { success: false, error: err.message };
    }
  };

  const updateExpediente = async (id: number, expedienteData: any) => {
    try {
      await expedientesAPI.update(id, expedienteData);
      toast.success('Expediente actualizado exitosamente');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar expediente');
      return { success: false, error: err.message };
    }
  };

  const deleteExpediente = async (id: number) => {
    try {
      await expedientesAPI.delete(id);
      toast.success('Expediente eliminado exitosamente');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar expediente');
      return { success: false, error: err.message };
    }
  };

  const enviarRevision = async (id: number, idCoordinador: number) => {
    try {
      await expedientesAPI.enviarRevision(id, {
        IdCoordinadorRevision: idCoordinador
      });
      toast.success('Expediente enviado a revisión');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al enviar a revisión');
      return { success: false, error: err.message };
    }
  };

  const aprobarExpediente = async (id: number, idCoordinador: number) => {
    try {
      await expedientesAPI.aprobar(id, { IdCoordinadorRevision: idCoordinador });
      toast.success('Expediente aprobado exitosamente');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al aprobar expediente');
      return { success: false, error: err.message };
    }
  };

  const rechazarExpediente = async (id: number, idCoordinador: number, observaciones: string) => {
    try {
      await expedientesAPI.rechazar(id, {
        IdCoordinadorRevision: idCoordinador,
        ObservacionesExpediente: observaciones
      });
      toast.success('Expediente rechazado');
      await fetchExpedientes();
      return { success: true };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al rechazar expediente');
      return { success: false, error: err.message };
    }
  };

  return {
    expedientes,
    loading,
    error,
    fetchExpedientes,
    createExpediente,
    updateExpediente,
    deleteExpediente,
    enviarRevision,
    aprobarExpediente,
    rechazarExpediente,
  };
};
