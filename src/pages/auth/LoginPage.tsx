import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/forms/LoginForm';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    const result = await login(credentials);
    setLoading(false);

    if (result.success) {
      toast.success('¡Bienvenido!');
      navigate('/');
    } else {
      toast.error(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dicri-primary to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-dicri-primary text-white p-4 rounded-full mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema DICRI
            </h1>
            <p className="text-gray-600">
              Gestión de Evidencias Criminalísticas
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} loading={loading} />

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Ministerio Público de Guatemala</p>
            <p className="mt-1">Dirección de Investigación Criminalística</p>
          </div>
        </div>
      </div>
    </div>
  );
};
