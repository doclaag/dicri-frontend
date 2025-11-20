import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '@/api/auth.api';
import type { Usuario, LoginCredentials } from '@/types';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isTecnico: () => boolean;
  isCoordinador: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const userData = response.user;
      setUser(userData);
      authAPI.saveUser(userData);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  const isTecnico = (): boolean => {
    return user?.IdRol === 1;
  };

  const isCoordinador = (): boolean => {
    return user?.IdRol === 2;
  };

  const hasPermission = (permission: string): boolean => {
    const permissions: Record<number, string[]> = {
      1: ['create_expediente', 'edit_expediente', 'create_indicio'],
      2: ['review_expediente', 'view_reportes'],
    };
    return permissions[user?.IdRol || 0]?.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isTecnico,
    isCoordinador,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
