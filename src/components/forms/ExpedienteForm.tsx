import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { validateExpedienteForm } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';
import type { ExpedienteFormData, Expediente } from '@/types';

interface ExpedienteFormProps {
  initialData?: Expediente | null;
  onSubmit: (data: ExpedienteFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ExpedienteForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}: ExpedienteFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ExpedienteFormData>({
    FileNumber: '',
    Description: '',
    IdTecnicoRegistro: user?.IdUsuario || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        FileNumber: initialData.FileNumber || '',
        Description: initialData.Description || '',
        IdTecnicoRegistro: initialData.IdTecnicoRegistro || user?.IdUsuario || 0,
      });
    }
  }, [initialData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateExpedienteForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Número de Expediente"
        name="FileNumber"
        value={formData.FileNumber}
        onChange={handleChange}
        error={errors.FileNumber}
        required
        placeholder="Ej: EXP-2024-001"
      />

      <div>
        <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="Description"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          rows={4}
          className={`input-field ${errors.Description ? 'border-red-500' : ''}`}
          placeholder="Descripción detallada del expediente"
        />
        {errors.Description && (
          <p className="mt-1 text-sm text-red-600">{errors.Description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Expediente'}
        </Button>
      </div>
    </form>
  );
};