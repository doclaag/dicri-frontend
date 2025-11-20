import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { IndicioForm } from '@/components/forms/IndicioForm';
import { useIndicios } from '@/hooks/useIndicios';
import { useAuth } from '@/context/AuthContext';
import { expedientesAPI } from '@/api/expedientes.api';
import { usuariosAPI } from '@/api/usuarios.api';
import { formatDateTime, formatEstado } from '@/utils/formatters';
import { Plus, ArrowLeft, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Select } from '@/components/common/Select';
import { useExpedientes } from '@/hooks/useExpedientes';

export const ExpedienteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isTecnico } = useAuth();
  const { enviarRevision } = useExpedientes();
  const { indicios, loading: loadingIndicios, createIndicio, deleteIndicio } = useIndicios(id);
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnviarModal, setShowEnviarModal] = useState(false);
  const [selectedIndicio, setSelectedIndicio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coordinadores, setCoordinadores] = useState([]);
  const [selectedCoordinador, setSelectedCoordinador] = useState('');

  useEffect(() => {
    fetchExpediente();
    fetchCoordinadores();
  }, [id]);

  const fetchExpediente = async () => {
    try {
      const data = await expedientesAPI.getById(parseInt(id!));
      setExpediente(data);
    } catch (error) {
      toast.error('Error al cargar expediente' + (error instanceof Error ? `: ${error.message}` : ''));
      navigate('/expedientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinadores = async () => {
    try {
      const data = await usuariosAPI.getCoordinadores();
      setCoordinadores(data);
    } catch (error) {
      console.error('Error al cargar coordinadores:', error);
    }
  };

  const handleCreateIndicio = async (formData) => {
    const result = await createIndicio({
      ...formData,
      IdTecnicoRegistro: user.IdUsuario,
    });

    if (result.success) {
      setShowCreateModal(false);
    }
  };

  const handleDeleteIndicio = async () => {
    if (selectedIndicio) {
      await deleteIndicio(selectedIndicio.IdIndicio);
      setShowDeleteModal(false);
      setSelectedIndicio(null);
    }
  };

  const handleEnviarRevision = async () => {
    if (!selectedCoordinador) {
      toast.error('Debe seleccionar un coordinador');
      return;
    }

    if (indicios.length === 0) {
      toast.error('Debe registrar al menos un indicio antes de enviar a revisión');
      return;
    }

    const result = await enviarRevision(
      parseInt(id!),
      parseInt(selectedCoordinador)
    );

    if (result.success) {
      setShowEnviarModal(false);
      fetchExpediente();
    }
  };

  const columns = [
    {
      header: 'Descripción',
      accessor: 'Description',
    },
    {
      header: 'Color',
      accessor: 'Color',
      cell: (row) => row.Color || '-',
    },
    {
      header: 'Tamaño',
      accessor: 'Size',
      cell: (row) => row.Size || '-',
    },
    {
      header: 'Peso',
      accessor: 'Weight',
      cell: (row) => row.Weight || '-',
    },
    {
      header: 'Ubicación',
      accessor: 'Location',
    },
    {
      header: 'Técnico',
      accessor: 'TecnicoRegistro',
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          {isTecnico() && expediente?.IdEstado === 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndicio(row);
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dicri-primary mx-auto"></div>
        </div>
      </Layout>
    );
  }

  const estado = formatEstado(expediente?.IdEstado);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/expedientes')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {expediente?.FileNumber}
              </h1>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${estado.color}`}>
                {estado.text}
              </span>
            </div>
          </div>
          {isTecnico() && expediente?.IdEstado === 1 && (
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Agregar Indicio</span>
              </Button>
              <Button
                variant="success"
                onClick={() => setShowEnviarModal(true)}
                className="flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Enviar a Revisión</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Información del Expediente" className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="mt-1 text-gray-900">{expediente?.Description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Técnico Registro</label>
                  <p className="mt-1 text-gray-900">{expediente?.TecnicoRegistro}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha Creación</label>
                  <p className="mt-1 text-gray-900">{formatDateTime(expediente?.CreatedAt)}</p>
                </div>
              </div>
              {expediente?.ObservacionesExpediente && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="text-sm font-medium text-red-800">Observaciones de Rechazo</label>
                  <p className="mt-1 text-red-900">{expediente.ObservacionesExpediente}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Resumen">
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Indicios</p>
                <p className="text-3xl font-bold text-dicri-primary">{indicios.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Indicios Registrados">
          {loadingIndicios ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dicri-primary mx-auto"></div>
            </div>
          ) : (
            <Table columns={columns} data={indicios} />
          )}
        </Card>
      </div>

      {/* Modal para crear indicio */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Agregar Indicio"
        size="lg"
      >
        <IndicioForm
          onSubmit={handleCreateIndicio}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal para enviar a revisión */}
      <Modal
        isOpen={showEnviarModal}
        onClose={() => setShowEnviarModal(false)}
        title="Enviar a Revisión"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Seleccione el coordinador que revisará este expediente:
          </p>
          <Select
            label="Coordinador"
            value={selectedCoordinador}
            onChange={(e) => setSelectedCoordinador(e.target.value)}
            options={coordinadores.map((coord) => ({
              value: coord.IdUsuario,
              label: coord.FullName,
            }))}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEnviarModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="success" onClick={handleEnviarRevision}>
              Enviar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación para eliminar indicio */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedIndicio(null);
        }}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Está seguro que desea eliminar este indicio?
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedIndicio(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteIndicio}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
