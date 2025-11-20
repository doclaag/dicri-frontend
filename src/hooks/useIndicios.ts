import { useState, useEffect } from 'react';
import { indiciosAPI } from '@/api/indicios.api';
import toast from 'react-hot-toast';

export const useIndicios = (idExpediente) => {
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIndicios = async () => {
    if (!idExpediente) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await indiciosAPI.getByExpediente(idExpediente);
      setIndicios(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar indicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicios();
  }, [idExpediente]);

  const createIndicio = async (indicioData) => {
    try {
      await indiciosAPI.create({ ...indicioData, IdExpediente: idExpediente });
      toast.success('Indicio creado exitosamente');
      await fetchIndicios();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear indicio');
      return { success: false, error: err.message };
    }
  };

  const updateIndicio = async (id, indicioData) => {
    try {
      await indiciosAPI.update(id, indicioData);
      toast.success('Indicio actualizado exitosamente');
      await fetchIndicios();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar indicio');
      return { success: false, error: err.message };
    }
  };

  const deleteIndicio = async (id) => {
    try {
      await indiciosAPI.delete(id);
      toast.success('Indicio eliminado exitosamente');
      await fetchIndicios();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar indicio');
      return { success: false, error: err.message };
    }
  };

  return {
    indicios,
    loading,
    error,
    fetchIndicios,
    createIndicio,
    updateIndicio,
    deleteIndicio,
  };
};
