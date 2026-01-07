import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { ClienteForm } from '../../components/cliente/ClienteForm';
import { useCliente } from '../../hooks/useClientes';
import { useClienteMutations } from '../../hooks/useClienteMutations';
import { CreateClienteDTO } from '../../application/dto/cliente.dto';

export function ClienteEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cliente, loading: loadingCliente, error: fetchError } = useCliente(id);
  const { updateCliente, loading: updating, error: updateError } = useClienteMutations();

  const handleSubmit = async (data: CreateClienteDTO) => {
    if (!id) return;

    try {
      await updateCliente({ id, ...data });
      navigate(`/clientes/${id}`);
    } catch {
      // Error is handled by the hook
    }
  };

  if (loadingCliente) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (fetchError || !cliente) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{fetchError || 'Cliente não encontrado'}</p>
        <Button onClick={() => navigate('/clientes')}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Editar Cliente" subtitle={cliente.nome} />

      {updateError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{updateError}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <ClienteForm
          initialData={cliente}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/clientes/${id}`)}
          isLoading={updating}
        />
      </div>
    </>
  );
}
