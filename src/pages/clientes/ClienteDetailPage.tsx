import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useCliente } from '../../hooks/useClientes';
import { useFichasByCliente } from '../../hooks/useFichas';
import { useFichaMutations } from '../../hooks/useFichaMutations';
import { FichaList } from '../../components/ficha/FichaList';

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cliente, loading, error } = useCliente(id);
  const { fichas, loading: fichasLoading, refetch: refetchFichas } = useFichasByCliente(id);
  const { deleteFicha, loading: deleteLoading } = useFichaMutations();
  const [fichaToDelete, setFichaToDelete] = useState<string | null>(null);

  const handleDeleteFicha = async () => {
    if (!fichaToDelete) return;
    try {
      await deleteFicha(fichaToDelete);
      setFichaToDelete(null);
      refetchFichas();
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

  if (error || !cliente) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error || 'Cliente não encontrado'}</p>
        <Button onClick={() => navigate('/clientes')}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={cliente.nome}
        subtitle="Detalhes do cliente"
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/clientes')}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/clientes/${id}/editar`)}>
              Editar
            </Button>
          </div>
        }
      />

      <div className="bg-white shadow rounded-lg p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nome</dt>
            <dd className="mt-1 text-sm text-gray-900">{cliente.nome}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Número de RG</dt>
            <dd className="mt-1 text-sm text-gray-900">{cliente.numeroRg}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Sexo</dt>
            <dd className="mt-1 text-sm text-gray-900">{cliente.sexo}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {cliente.dataNascimento
                ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')
                : '-'}
            </dd>
          </div>

          {cliente.nomeCuidador && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Nome do Cuidador</dt>
              <dd className="mt-1 text-sm text-gray-900">{cliente.nomeCuidador}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Fichas Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Fichas</h2>
          <Button onClick={() => navigate(`/clientes/${id}/fichas/novo`)}>
            Nova Ficha
          </Button>
        </div>

        {fichasLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Carregando fichas...</p>
          </div>
        ) : (
          <FichaList
            fichas={fichas}
            clienteId={id!}
            onDelete={(fichaId) => setFichaToDelete(fichaId)}
          />
        )}
      </div>

      <Modal
        isOpen={!!fichaToDelete}
        onClose={() => setFichaToDelete(null)}
        title="Confirmar exclusão"
      >
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir esta ficha? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setFichaToDelete(null)}
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteFicha}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
