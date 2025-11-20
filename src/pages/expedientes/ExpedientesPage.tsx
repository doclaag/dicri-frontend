import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { ExpedienteForm } from '@/components/forms/ExpedienteForm';
import { useExpedientes } from '@/hooks/useExpedientes';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime, formatEstado } from '@/utils/formatters';
import { Plus, Eye, Trash2 } from 'lucide-react';

export const ExpedientesPage = () => {
  const navigate = useNavigate();
  const { user, isTecnico } = useAuth();
  const { expedientes, loading, createExpediente, deleteExpediente } = useExpedientes();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreate = async (formData) => {
    const result = await createExpediente({
      ...formData,
      IdEstado: 1,
    });

    if (result.success) {
      setShowCreateModal(false);
    }
  };

  const handleDelete = async () => {
    if (selectedExpediente) {
      await deleteExpediente(selectedExpediente.IdExpediente);
      setShowDeleteModal(false);
      setSelectedExpediente(null);
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
      header: 'Estado',
      accessor: 'StateName',
      cell: (row) => {
        const estado = formatEstado(row.IdEstado);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}>
            {estado.text}
          </span>
        );
      },
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
          {isTecnico() && row.IdEstado === 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExpediente(row);
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:text-red-800"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expedientes</h1>
            <p className="text-gray-600 mt-2">
              Gestión de expedientes criminalísticos
            </p>
          </div>
          {isTecnico() && (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Expediente</span>
            </Button>
          )}
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dicri-primary mx-auto"></div>
            </div>
          ) : (
            <Table
              columns={columns}
              data={expedientes}
              onRowClick={handleViewDetail}
            />
          )}
        </Card>
      </div>

      {/* Modal para crear expediente */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Expediente"
        size="lg"
      >
        <ExpedienteForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedExpediente(null);
        }}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Está seguro que desea eliminar el expediente{' '}
            <strong>{selectedExpediente?.FileNumber}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer y eliminará todos los indicios asociados.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedExpediente(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
