import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { ClienteForm } from '../../components/cliente/ClienteForm';
import { useClienteMutations } from '../../hooks/useClienteMutations';
import { CreateClienteDTO } from '../../application/dto/cliente.dto';

export function ClienteCreatePage() {
  const navigate = useNavigate();
  const { createCliente, loading, error } = useClienteMutations();

  const handleSubmit = async (data: CreateClienteDTO) => {
    try {
      await createCliente(data);
      navigate('/clientes');
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <PageHeader title="Novo Cliente" subtitle="Preencha os dados do cliente" />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <ClienteForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/clientes')}
          isLoading={loading}
        />
      </div>
    </>
  );
}
