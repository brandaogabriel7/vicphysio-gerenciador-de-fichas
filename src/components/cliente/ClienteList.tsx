import { useNavigate } from 'react-router-dom';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { ClienteDTO } from '../../application/dto/cliente.dto';

interface ClienteListProps {
  clientes: ClienteDTO[];
  onDelete: (id: string) => void;
}

export function ClienteList({ clientes, onDelete }: ClienteListProps) {
  const navigate = useNavigate();

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'numeroRg', header: 'RG' },
    { key: 'sexo', header: 'Sexo' },
    {
      key: 'dataNascimento',
      header: 'Data de Nascimento',
      render: (cliente: ClienteDTO) =>
        cliente.dataNascimento
          ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')
          : '-',
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (cliente: ClienteDTO) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/clientes/${cliente.id}`)}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(cliente.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={clientes}
      columns={columns}
      keyExtractor={(cliente) => cliente.id}
      onRowClick={(cliente) => navigate(`/clientes/${cliente.id}`)}
      emptyMessage="Nenhum cliente cadastrado"
    />
  );
}
