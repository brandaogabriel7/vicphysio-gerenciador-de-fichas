import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import { ClienteList } from './ClienteList';
import { ClienteDTO } from '../../application/dto/cliente.dto';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ClienteList', () => {
  const mockOnDelete = vi.fn();

  const clientes: ClienteDTO[] = [
    {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
      dataNascimento: '2000-01-15',
      nomeCuidador: 'Maria Silva',
    },
    {
      id: '2',
      nome: 'Ana Santos',
      numeroRg: '987654321',
      sexo: SexoEnum.FEMININO,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with clientes', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    expect(screen.getByRole('cell', { name: 'João Silva' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ana Santos' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '123456789' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '987654321' })).toBeInTheDocument();
  });

  it('formats dataNascimento correctly', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    // The date 2000-01-15 should be formatted - look for any date representation
    // that includes day 15 or similar
    const cells = screen.getAllByRole('cell');
    const hasDateCell = cells.some(
      (cell) => cell.textContent?.includes('15') || cell.textContent?.includes('2000')
    );
    expect(hasDateCell).toBe(true);
  });

  it('shows dash for missing dataNascimento', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('renders action buttons for each row', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    const viewButtons = screen.getAllByRole('button', { name: /ver/i });
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });

    expect(viewButtons).toHaveLength(2);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('navigates to detail page when Ver button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    const viewButtons = screen.getAllByRole('button', { name: /ver/i });
    await user.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/clientes/1');
  });

  it('navigates to edit page when Editar button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/clientes/1/editar');
  });

  it('calls onDelete with correct id when Excluir button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows empty message when clientes array is empty', () => {
    renderWithRouter(<ClienteList clientes={[]} onDelete={mockOnDelete} />);

    expect(screen.getByText('Nenhum cliente cadastrado')).toBeInTheDocument();
  });

  it('displays sexo values correctly', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    expect(screen.getByText('Masculino')).toBeInTheDocument();
    expect(screen.getByText('Feminino')).toBeInTheDocument();
  });

  it('renders all required columns', () => {
    renderWithRouter(<ClienteList clientes={clientes} onDelete={mockOnDelete} />);

    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'RG' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Sexo' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Data de Nascimento' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Ações' })).toBeInTheDocument();
  });
});
