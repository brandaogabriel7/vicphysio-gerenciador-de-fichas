import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table';

interface TestItem {
  id: string;
  name: string;
  age: number;
}

const testData: TestItem[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
];

const columns = [
  { key: 'name', header: 'Nome' },
  { key: 'age', header: 'Idade' },
];

describe('Table', () => {
  it('shows empty message when data is empty', () => {
    render(
      <Table
        data={[]}
        columns={columns}
        keyExtractor={(item: TestItem) => item.id}
      />
    );
    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <Table
        data={[]}
        columns={columns}
        keyExtractor={(item: TestItem) => item.id}
        emptyMessage="Sem dados disponíveis"
      />
    );
    expect(screen.getByText('Sem dados disponíveis')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );
    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Idade' })).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Bob' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Charlie' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '30' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '25' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '35' })).toBeInTheDocument();
  });

  it('uses custom render function', () => {
    const columnsWithRender = [
      { key: 'name', header: 'Nome' },
      {
        key: 'age',
        header: 'Idade',
        render: (item: TestItem) => `${item.age} anos`,
      },
    ];

    render(
      <Table
        data={testData}
        columns={columnsWithRender}
        keyExtractor={(item) => item.id}
      />
    );
    expect(screen.getByRole('cell', { name: '30 anos' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '25 anos' })).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    const handleRowClick = vi.fn();
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
      />
    );

    const row = screen.getByRole('row', { name: /Alice/ });
    await user.click(row);
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('renders correct number of rows', () => {
    render(
      <Table
        data={testData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );

    // Header row + 3 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });
});
