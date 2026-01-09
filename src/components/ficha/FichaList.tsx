import { useNavigate } from 'react-router-dom';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { FichaDTO } from '../../application/dto/ficha.dto';

interface FichaListProps {
  fichas: FichaDTO[];
  clienteId: string;
  onDelete: (id: string) => void;
}

export function FichaList({ fichas, clienteId, onDelete }: FichaListProps) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'data',
      header: 'Data',
      render: (ficha: FichaDTO) =>
        ficha.data
          ? new Date(ficha.data).toLocaleDateString('pt-BR')
          : '-',
    },
    { key: 'tipoFicha', header: 'Tipo' },
    {
      key: 'historiaMolestiaAtual',
      header: 'Resumo',
      render: (ficha: FichaDTO) => {
        const text = ficha.historiaMolestiaAtual || '-';
        return text.length > 50 ? `${text.substring(0, 50)}...` : text;
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (ficha: FichaDTO) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/clientes/${clienteId}/fichas/${ficha.id}`)}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/clientes/${clienteId}/fichas/${ficha.id}/editar`)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(ficha.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={fichas}
      columns={columns}
      keyExtractor={(ficha) => ficha.id}
      onRowClick={(ficha) => navigate(`/clientes/${clienteId}/fichas/${ficha.id}`)}
      emptyMessage="Nenhuma ficha cadastrada"
    />
  );
}
