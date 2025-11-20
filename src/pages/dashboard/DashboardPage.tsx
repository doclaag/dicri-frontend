import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';
import { reportesAPI } from '@/api/reportes.api';
import { expedientesAPI } from '@/api/expedientes.api';
import type { EstadisticasGenerales, Expediente } from '@/types';
import { FolderOpen, ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';

export const DashboardPage = () => {
  const { user, isTecnico, isCoordinador } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null);
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExpedientes = await expedientesAPI.getAll();

        const expedientesFiltrados = allExpedientes.filter((exp) => {
          if (isTecnico()) {
            return exp.IdTecnicoRegistro === user?.IdUsuario;
          } else if (isCoordinador()) {
            return exp.IdCoordinadorRevision === user?.IdUsuario;
          }
          return false;
        });

        setExpedientes(expedientesFiltrados);

        const totalExpedientes = expedientesFiltrados.length;
        const totalIndicios = 0;

        const expedientesPorEstado = expedientesFiltrados.reduce((acc, exp) => {
          const estado = exp.StateName;
          if (!acc[estado]) {
            acc[estado] = 0;
          }
          acc[estado]++;
          return acc;
        }, {} as Record<string, number>);

        const estadisticasPorEstado = Object.entries(expedientesPorEstado).map(([estado, cantidad]) => ({
          StateName: estado,
          Cantidad: cantidad,
          Porcentaje: totalExpedientes > 0 ? Math.round((cantidad / totalExpedientes) * 100) : 0,
        }));

        setEstadisticas({
          estadisticasPorEstado,
          totales: {
            TotalExpedientes: totalExpedientes,
            TotalIndicios: totalIndicios,
            TotalUsuariosActivos: 0,
          },
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isTecnico, isCoordinador]);

  const getEstadoCantidad = (nombreEstado: string): number => {
    const estado = estadisticas?.estadisticasPorEstado?.find(
      (e) => e.StateName === nombreEstado
    );
    return estado?.Cantidad || 0;
  };

  const stats = [
    {
      label: 'Total Expedientes',
      value: estadisticas?.totales?.TotalExpedientes || 0,
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Indicios',
      value: estadisticas?.totales?.TotalIndicios || 0,
      icon: ClipboardCheck,
      color: 'bg-purple-500',
    },
    {
      label: 'Aprobados',
      value: getEstadoCantidad('Aprobado'),
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Rechazados',
      value: getEstadoCantidad('Rechazado'),
      icon: XCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.FullName}
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de control - Sistema de Gestión de Evidencias DICRI
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dicri-primary mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {estadisticas?.estadisticasPorEstado && estadisticas.estadisticasPorEstado.length > 0 && (
              <Card title="Mis Expedientes por Estado">
                <div className="space-y-4">
                  {estadisticas.estadisticasPorEstado.map((estado, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">
                          {estado.StateName}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-dicri-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${estado.Porcentaje}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="text-2xl font-bold text-dicri-primary">
                          {estado.Cantidad}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({estado.Porcentaje}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};