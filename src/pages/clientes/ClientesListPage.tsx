import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { ClienteList } from '../../components/cliente/ClienteList';
import { ConfirmModal } from '../../components/ui/Modal';
import { useClientes } from '../../hooks/useClientes';
import { useClienteMutations } from '../../hooks/useClienteMutations';

export function ClientesListPage() {
  const navigate = useNavigate();
  const { clientes, loading, error, refetch } = useClientes();
  const { deleteCliente, loading: deleting } = useClienteMutations();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCliente(deleteId);
      setDeleteId(null);
      refetch();
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetch}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} cliente(s) cadastrado(s)`}
        actions={
          <Button onClick={() => navigate('/clientes/novo')}>
            Novo Cliente
          </Button>
        }
      />

      <div className="bg-white shadow rounded-lg">
        <ClienteList clientes={clientes} onDelete={(id) => setDeleteId(id)} />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        isLoading={deleting}
      />
    </>
  );
}
