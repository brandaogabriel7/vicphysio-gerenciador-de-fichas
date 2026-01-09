import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { FichaForm } from '../../components/ficha/FichaForm';
import { useFichaMutations } from '../../hooks/useFichaMutations';
import { useCliente } from '../../hooks/useClientes';
import { CreateFichaDTO } from '../../application/dto/ficha.dto';

export function FichaCreatePage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { createFicha, loading: mutationLoading, error: mutationError } = useFichaMutations();
  const { cliente, loading: clienteLoading } = useCliente(clienteId);

  const handleSubmit = async (data: CreateFichaDTO) => {
    try {
      await createFicha(data);
      navigate(`/clientes/${clienteId}`);
    } catch {
      // Error is handled by the hook
    }
  };

  if (clienteLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!clienteId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">Cliente não encontrado</p>
        <Button onClick={() => navigate('/clientes')}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Nova Ficha"
        subtitle={cliente ? `Cliente: ${cliente.nome}` : 'Preencha os dados da ficha'}
        actions={
          <Button variant="secondary" onClick={() => navigate(`/clientes/${clienteId}`)}>
            Voltar
          </Button>
        }
      />

      {mutationError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{mutationError}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <FichaForm
          clienteId={clienteId}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/clientes/${clienteId}`)}
          isLoading={mutationLoading}
        />
      </div>
    </>
  );
}
