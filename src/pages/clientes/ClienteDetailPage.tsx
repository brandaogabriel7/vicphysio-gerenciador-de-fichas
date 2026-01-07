import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useCliente } from '../../hooks/useClientes';

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cliente, loading, error } = useCliente(id);

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
    </>
  );
}
