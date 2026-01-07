import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import { ClientesListPage } from './ClientesListPage';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import {
  mockUseClientes,
  resetMocks as resetClientesMocks,
} from '../../hooks/__mocks__/useClientes';
import {
  mockUseClienteMutations,
  resetMocks as resetMutationsMocks,
} from '../../hooks/__mocks__/useClienteMutations';

vi.mock('../../hooks/useClientes');
vi.mock('../../hooks/useClienteMutations');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ClientesListPage', () => {
  beforeEach(() => {
    resetClientesMocks();
    resetMutationsMocks();
    mockNavigate.mockClear();
  });

  it('shows loading state', () => {
    mockUseClientes.loading = true;

    renderWithRouter(<ClientesListPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows error state with retry button', async () => {
    const user = userEvent.setup();
    mockUseClientes.error = 'Erro ao carregar clientes';

    renderWithRouter(<ClientesListPage />);

    expect(screen.getByText('Erro ao carregar clientes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(mockUseClientes.refetch).toHaveBeenCalled();
  });

  it('renders page header with client count', () => {
    mockUseClientes.clientes = [
      { id: '1', nome: 'João', numeroRg: '123', sexo: SexoEnum.MASCULINO },
      { id: '2', nome: 'Maria', numeroRg: '456', sexo: SexoEnum.FEMININO },
    ];

    renderWithRouter(<ClientesListPage />);

    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByText('2 cliente(s) cadastrado(s)')).toBeInTheDocument();
  });

  it('renders client list', () => {
    mockUseClientes.clientes = [
      { id: '1', nome: 'João Silva', numeroRg: '123456789', sexo: SexoEnum.MASCULINO },
    ];

    renderWithRouter(<ClientesListPage />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });

  it('navigates to create page when "Novo Cliente" is clicked', async () => {
    const user = userEvent.setup();
    mockUseClientes.clientes = [];

    renderWithRouter(<ClientesListPage />);

    await user.click(screen.getByRole('button', { name: /novo cliente/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes/novo');
  });

  it('opens delete confirmation modal when delete button is clicked', async () => {
    const user = userEvent.setup();
    mockUseClientes.clientes = [
      { id: '1', nome: 'João', numeroRg: '123', sexo: SexoEnum.MASCULINO },
    ];

    renderWithRouter(<ClientesListPage />);

    await user.click(screen.getByRole('button', { name: /excluir/i }));

    expect(screen.getByRole('heading', { name: 'Excluir Cliente' })).toBeInTheDocument();
    expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();
  });

  it('closes delete modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    mockUseClientes.clientes = [
      { id: '1', nome: 'João', numeroRg: '123', sexo: SexoEnum.MASCULINO },
    ];

    renderWithRouter(<ClientesListPage />);

    await user.click(screen.getByRole('button', { name: /excluir/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.queryByRole('heading', { name: 'Excluir Cliente' })).not.toBeInTheDocument();
  });

  it('calls deleteCliente and refetch when confirm delete is clicked', async () => {
    const user = userEvent.setup();
    mockUseClientes.clientes = [
      { id: '1', nome: 'João', numeroRg: '123', sexo: SexoEnum.MASCULINO },
    ];
    mockUseClienteMutations.deleteCliente.mockResolvedValueOnce(undefined);

    renderWithRouter(<ClientesListPage />);

    await user.click(screen.getByRole('button', { name: /excluir/i }));
    await user.click(screen.getAllByRole('button', { name: /excluir/i })[1]);

    await waitFor(() => {
      expect(mockUseClienteMutations.deleteCliente).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(mockUseClientes.refetch).toHaveBeenCalled();
    });
  });
});
