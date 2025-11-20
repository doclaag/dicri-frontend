import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { ReportTable } from '@/components/reports/ReportTable';
import { StatsCards } from '@/components/reports/StatsCards';
import { EstadisticasChart } from '@/components/reports/EstadisticasChart';
import { reportesAPI } from '@/api/reportes.api';
import type {
  EstadisticasGenerales,
  ReporteExpediente,
  ReporteTecnico,
  ReporteCoordinador,
  TableColumn
} from '@/types';
import { formatDate } from '@/utils/formatters';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

type ReportData = EstadisticasGenerales | ReporteExpediente[] | ReporteTecnico[] | ReporteCoordinador[] | null;

export const ReportesPage = () => {
  const [reportType, setReportType] = useState('expedientes');
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
  });
  const [reportData, setReportData] = useState<ReportData>(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let data: ReportData = null;
      const parsedFilters = {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        estado: filters.estado ? parseInt(filters.estado) : undefined,
      };

      switch (reportType) {
        case 'expedientes':
          data = await reportesAPI.getReporteExpedientes(parsedFilters);
          break;
        case 'estadisticas':
          data = await reportesAPI.getEstadisticas(parsedFilters);
          break;
        case 'tecnicos':
          data = await reportesAPI.getReporteTecnicos();
          break;
        case 'coordinadores':
          data = await reportesAPI.getReporteCoordinadores();
          break;
      }

      setReportData(data);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const isEstadisticas = (data: ReportData): data is EstadisticasGenerales => {
    return data !== null && typeof data === 'object' && 'estadisticasPorEstado' in data;
  };

  const isExpedientes = (data: ReportData): data is ReporteExpediente[] => {
    return Array.isArray(data) && data.length > 0 && 'FileNumber' in data[0];
  };

  const isTecnicos = (data: ReportData): data is ReporteTecnico[] => {
    return Array.isArray(data) && data.length > 0 && 'TotalExpedientes' in data[0];
  };

  const isCoordinadores = (data: ReportData): data is ReporteCoordinador[] => {
    return Array.isArray(data) && data.length > 0 && 'TotalRevisiones' in data[0];
  };

  const getEstadoColor = (estadoNombre: string): string => {
    const colores: Record<string, string> = {
      'Registrando': 'bg-yellow-100 text-yellow-800',
      'En Revisión': 'bg-blue-100 text-blue-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'Rechazado': 'bg-red-100 text-red-800',
    };
    return colores[estadoNombre] || 'bg-gray-100 text-gray-800';
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    let csvContent = '';
    let filename = 'reporte.csv';

    if (isExpedientes(reportData)) {
      filename = 'reporte_expedientes.csv';
      csvContent = 'Expediente,Descripción,Estado,Técnico,Coordinador,Fecha Creación\n';
      reportData.forEach((row) => {
        csvContent += `"${row.FileNumber}","${row.Description}","${row.StateName}","${row.TecnicoRegistro}","${row.CoordinadorRevision || 'N/A'}","${formatDate(row.CreatedAt)}"\n`;
      });
    } else if (isEstadisticas(reportData)) {
      filename = 'estadisticas.csv';
      csvContent = 'Estado,Cantidad,Porcentaje\n';
      reportData.estadisticasPorEstado.forEach((est) => {
        csvContent += `"${est.StateName}",${est.Cantidad},${est.Porcentaje}%\n`;
      });
    } else if (isTecnicos(reportData)) {
      filename = 'reporte_tecnicos.csv';
      csvContent = 'Técnico,Total Expedientes,Total Indicios,Aprobados,Rechazados\n';
      reportData.forEach((row) => {
        csvContent += `"${row.FullName}",${row.TotalExpedientes},${row.TotalIndicios},${row.ExpedientesAprobados},${row.ExpedientesRechazados}\n`;
      });
    } else if (isCoordinadores(reportData)) {
      filename = 'reporte_coordinadores.csv';
      csvContent = 'Coordinador,Total Revisiones,Aprobados,Rechazados\n';
      reportData.forEach((row) => {
        csvContent += `"${row.FullName}",${row.TotalRevisiones},${row.TotalAprobados},${row.TotalRechazados}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reporte exportado exitosamente');
  };

  // ✅ Definición de columnas para cada tabla
  const expedientesColumns: TableColumn<ReporteExpediente>[] = [
    { header: 'Expediente', accessor: 'FileNumber' },
    { header: 'Descripción', accessor: 'Description' },
    {
      header: 'Estado',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(row.StateName)}`}>
          {row.StateName}
        </span>
      ),
    },
    { header: 'Técnico', accessor: 'TecnicoRegistro' },
    { header: 'Coordinador', cell: (row) => row.CoordinadorRevision || '-' },
    { header: 'Fecha', cell: (row) => formatDate(row.CreatedAt) },
  ];

  const tecnicosColumns: TableColumn<ReporteTecnico>[] = [
    { header: 'Técnico', accessor: 'FullName' },
    { header: 'Expedientes', accessor: 'TotalExpedientes' },
    { header: 'Indicios', accessor: 'TotalIndicios' },
    {
      header: 'Aprobados',
      cell: (row) => <span className="text-green-600 font-medium">{row.ExpedientesAprobados}</span>,
    },
    {
      header: 'Rechazados',
      cell: (row) => <span className="text-red-600 font-medium">{row.ExpedientesRechazados}</span>,
    },
  ];

  const coordinadoresColumns: TableColumn<ReporteCoordinador>[] = [
    { header: 'Coordinador', accessor: 'FullName' },
    { header: 'Revisiones', accessor: 'TotalRevisiones' },
    {
      header: 'Aprobados',
      cell: (row) => <span className="text-green-600 font-medium">{row.TotalAprobados}</span>,
    },
    {
      header: 'Rechazados',
      cell: (row) => <span className="text-red-600 font-medium">{row.TotalRechazados}</span>,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-2">Genera reportes personalizados del sistema</p>
        </div>

        <Card>
          <div className="space-y-4">
            <Select
              label="Tipo de Reporte"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'expedientes', label: 'Reporte de Expedientes' },
                { value: 'estadisticas', label: 'Estadísticas Generales' },
                { value: 'tecnicos', label: 'Reporte de Técnicos' },
                { value: 'coordinadores', label: 'Reporte de Coordinadores' },
              ]}
            />

            {(reportType === 'expedientes' || reportType === 'estadisticas') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Fecha Inicio"
                  name="fechaInicio"
                  type="date"
                  value={filters.fechaInicio}
                  onChange={handleFilterChange}
                />
                <Input
                  label="Fecha Fin"
                  name="fechaFin"
                  type="date"
                  value={filters.fechaFin}
                  onChange={handleFilterChange}
                />
                <Select
                  label="Estado"
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: '1', label: 'Registrando' },
                    { value: '2', label: 'En Revisión' },
                    { value: '3', label: 'Aprobado' },
                    { value: '4', label: 'Rechazado' },
                  ]}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleGenerateReport} disabled={loading} className="flex items-center gap-2">
                <FileText size={18} />
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>

              {reportData && (
                <Button variant="secondary" onClick={handleExportCSV} className="flex items-center gap-2">
                  <Download size={18} />
                  Exportar CSV
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* ✅ Renderizado optimizado */}
        {reportData && (
          <>
            {isExpedientes(reportData) && (
              <ReportTable
                title="Reporte de Expedientes"
                columns={expedientesColumns}
                data={reportData}
                getRowKey={(row) => row.IdExpediente}
              />
            )}

            {isEstadisticas(reportData) && (
              <>
                <StatsCards
                  stats={[
                    { label: 'Total Expedientes', value: reportData.totales.TotalExpedientes, color: 'text-[--color-dicri-primary]' },
                    { label: 'Total Indicios', value: reportData.totales.TotalIndicios, color: 'text-purple-600' },
                    { label: 'Usuarios Activos', value: reportData.totales.TotalUsuariosActivos, color: 'text-green-600' },
                  ]}
                />
                <EstadisticasChart data={reportData.estadisticasPorEstado} />
              </>
            )}

            {isTecnicos(reportData) && (
              <ReportTable
                title="Reporte de Técnicos"
                columns={tecnicosColumns}
                data={reportData}
                getRowKey={(row) => row.IdUsuario}
              />
            )}

            {isCoordinadores(reportData) && (
              <ReportTable
                title="Reporte de Coordinadores"
                columns={coordinadoresColumns}
                data={reportData}
                getRowKey={(row) => row.IdUsuario}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};