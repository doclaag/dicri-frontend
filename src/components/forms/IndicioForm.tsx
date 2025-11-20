import { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { validateIndicioForm } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';
import type { IndicioFormData, Indicio } from '@/types';

interface IndicioFormProps {
  initialData?: Indicio | null;
  onSubmit: (data: IndicioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const IndicioForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}: IndicioFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IndicioFormData>({
    Description: '',
    Color: '',
    Size: '',
    Weight: '',
    Location: '',
    IdTecnicoRegistro: user?.IdUsuario || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        Description: initialData.Description || '',
        Color: initialData.Color || '',
        Size: initialData.Size || '',
        Weight: initialData.Weight || '',
        Location: initialData.Location || '',
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

    const validation = validateIndicioForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="Description"
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          rows={3}
          className={`input-field ${errors.Description ? 'border-red-500' : ''}`}
          placeholder="Descripción detallada del indicio"
        />
        {errors.Description && (
          <p className="mt-1 text-sm text-red-600">{errors.Description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Color"
          name="Color"
          value={formData.Color}
          onChange={handleChange}
          placeholder="Ej: Negro, Plateado"
        />

        <Input
          label="Tamaño"
          name="Size"
          value={formData.Size}
          onChange={handleChange}
          placeholder="Ej: 15cm x 10cm"
        />
      </div>

      <Input
        label="Peso"
        name="Weight"
        value={formData.Weight}
        onChange={handleChange}
        placeholder="Ej: 250g"
      />

      <Input
        label="Ubicación"
        name="Location"
        value={formData.Location}
        onChange={handleChange}
        error={errors.Location}
        required
        placeholder="Ubicación donde se encontró el indicio"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Agregar Indicio'}
        </Button>
      </div>
    </form>
  );
};