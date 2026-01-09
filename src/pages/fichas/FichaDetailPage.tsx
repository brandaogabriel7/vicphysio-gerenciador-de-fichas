import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { FichaCard } from '../../components/ficha/FichaCard';
import { useFicha } from '../../hooks/useFichas';
import { useFichaMutations } from '../../hooks/useFichaMutations';
import { Modal } from '../../components/ui/Modal';
import { useState } from 'react';

export function FichaDetailPage() {
  const { clienteId, fichaId } = useParams<{ clienteId: string; fichaId: string }>();
  const navigate = useNavigate();
  const { ficha, loading, error } = useFicha(fichaId);
  const { deleteFicha, loading: deleteLoading } = useFichaMutations();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!fichaId) return;
    try {
      await deleteFicha(fichaId);
      navigate(`/clientes/${clienteId}`);
    } catch {
      // Error is handled by the hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error || !ficha) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error || 'Ficha não encontrada'}</p>
        <Button onClick={() => navigate(`/clientes/${clienteId}`)}>Voltar</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Ficha - ${ficha.tipoFicha}`}
        subtitle={`Cliente: ${ficha.cliente.nome}`}
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(`/clientes/${clienteId}`)}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/clientes/${clienteId}/fichas/${fichaId}/editar`)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Excluir
            </Button>
          </div>
        }
      />

      <FichaCard ficha={ficha} />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar exclusão"
      >
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir esta ficha? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
