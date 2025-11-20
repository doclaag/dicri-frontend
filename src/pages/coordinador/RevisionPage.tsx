import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { useExpedientes } from '@/hooks/useExpedientes';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/utils/formatters';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export const RevisionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { expedientes, loading, aprobarExpediente, rechazarExpediente } = useExpedientes();
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const expedientesEnRevision = expedientes.filter(
    (exp) => exp.IdEstado === 2
  );

  const handleAprobar = async () => {
    if (selectedExpediente) {
      await aprobarExpediente(selectedExpediente.IdExpediente, user.IdUsuario);
      setShowAprobarModal(false);
      setSelectedExpediente(null);
    }
  };

  const handleRechazar = async () => {
    if (!observaciones.trim()) {
      return;
    }

    if (selectedExpediente) {
      await rechazarExpediente(
        selectedExpediente.IdExpediente,
        user.IdUsuario,
        observaciones
      );
      setShowRechazarModal(false);
      setSelectedExpediente(null);
      setObservaciones('');
    }
  };

  const handleViewDetail = (expediente) => {
    navigate(`/expedientes/${expediente.IdExpediente}`);
  };

  const columns = [
    {
      header: 'No. Expediente',
      accessor: 'FileNumber',
    },
    {
      header: 'Descripción',
      accessor: 'Description',
      cell: (row) => (
        <span className="max-w-xs truncate block" title={row.Description}>
          {row.Description}
        </span>
      ),
    },
    {
      header: 'Técnico',
      accessor: 'TecnicoRegistro',
    },
    {
      header: 'Fecha Creación',
      accessor: 'CreatedAt',
      cell: (row) => formatDateTime(row.CreatedAt),
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(row);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Ver detalle"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpediente(row);
              setShowAprobarModal(true);
            }}
            className="text-green-600 hover:text-green-800"
            title="Aprobar"
          >
            <CheckCircle size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpediente(row);
              setShowRechazarModal(true);
            }}
            className="text-red-600 hover:text-red-800"
            title="Rechazar"
          >
            <XCircle size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revisión de Expedientes</h1>
          <p className="text-gray-600 mt-2">
            Expedientes pendientes de revisión y aprobación
          </p>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dicri-primary mx-auto"></div>
            </div>
          ) : expedientesEnRevision.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay expedientes pendientes de revisión</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={expedientesEnRevision}
              onRowClick={handleViewDetail}
            />
          )}
        </Card>
      </div>

      <Modal
        isOpen={showAprobarModal}
        onClose={() => {
          setShowAprobarModal(false);
          setSelectedExpediente(null);
        }}
        title="Aprobar Expediente"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Está seguro que desea aprobar el expediente{' '}
            <strong>{selectedExpediente?.FileNumber}</strong>?
          </p>
          <p className="text-sm text-green-600">
            Una vez aprobado, el expediente quedará finalizado.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAprobarModal(false);
                setSelectedExpediente(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="success" onClick={handleAprobar}>
              <CheckCircle size={18} className="mr-2" />
              Aprobar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRechazarModal}
        onClose={() => {
          setShowRechazarModal(false);
          setSelectedExpediente(null);
          setObservaciones('');
        }}
        title="Rechazar Expediente"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Expediente: <strong>{selectedExpediente?.FileNumber}</strong>
          </p>
          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones del Rechazo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Indique las razones del rechazo y correcciones necesarias..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRechazarModal(false);
                setSelectedExpediente(null);
                setObservaciones('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleRechazar}
              disabled={!observaciones.trim()}
            >
              <XCircle size={18} className="mr-2" />
              Rechazar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
