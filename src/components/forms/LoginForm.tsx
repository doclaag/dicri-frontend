import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { validateLoginForm } from '@/utils/validators';
import type { LoginFormData } from '@/types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
}

export const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    Username: '',
    Password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Usuario"
        name="Username"
        type="text"
        value={formData.Username}
        onChange={handleChange}
        error={errors.Username}
        required
        placeholder="Ingrese su usuario"
      />

      <Input
        label="Contraseña"
        name="Password"
        type="password"
        value={formData.Password}
        onChange={handleChange}
        error={errors.Password}
        required
        placeholder="Ingrese su contraseña"
      />

      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};