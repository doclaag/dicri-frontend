import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';

import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ExpedientesPage } from '@/pages/expedientes/ExpedientesPage';
import { ExpedienteDetailPage } from '@/pages/expedientes/ExpedienteDetailPage';
import { RevisionPage } from '@/pages/coordinador/RevisionPage';
import { ReportesPage } from '@/pages/reportes/ReportesPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/expedientes"
          element={
            <PrivateRoute>
              <ExpedientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/expedientes/:id"
          element={
            <PrivateRoute>
              <ExpedienteDetailPage />
            </PrivateRoute>
          }
        />

        {/* Rutas privadas (Solo Coordinadores) */}
        <Route
          path="/revision"
          element={
            <PrivateRoute requiredRole={2}>
              <RevisionPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <PrivateRoute requiredRole={2}>
              <ReportesPage />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
