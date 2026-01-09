import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { FichaForm } from '../../components/ficha/FichaForm';
import { useFicha } from '../../hooks/useFichas';
import { useFichaMutations } from '../../hooks/useFichaMutations';
import { CreateFichaDTO } from '../../application/dto/ficha.dto';

export function FichaEditPage() {
  const { clienteId, fichaId } = useParams<{ clienteId: string; fichaId: string }>();
  const navigate = useNavigate();
  const { ficha, loading: fichaLoading, error: fichaError } = useFicha(fichaId);
  const { updateFicha, loading: mutationLoading, error: mutationError } = useFichaMutations();

  const handleSubmit = async (data: CreateFichaDTO) => {
    if (!fichaId) return;
    try {
      await updateFicha({ ...data, id: fichaId });
      navigate(`/clientes/${clienteId}/fichas/${fichaId}`);
    } catch {
      // Error is handled by the hook
    }
  };

  if (fichaLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (fichaError || !ficha || !clienteId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{fichaError || 'Ficha não encontrada'}</p>
        <Button onClick={() => navigate(`/clientes/${clienteId}`)}>Voltar</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Editar Ficha"
        subtitle={`Cliente: ${ficha.cliente.nome}`}
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(`/clientes/${clienteId}/fichas/${fichaId}`)}
          >
            Cancelar
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
          initialData={ficha}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/clientes/${clienteId}/fichas/${fichaId}`)}
          isLoading={mutationLoading}
        />
      </div>
    </>
  );
}
