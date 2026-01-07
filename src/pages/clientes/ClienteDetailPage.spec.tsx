import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import { ClienteDetailPage } from './ClienteDetailPage';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import {
  mockUseCliente,
  resetMocks as resetClientesMocks,
} from '../../hooks/__mocks__/useClientes';

vi.mock('../../hooks/useClientes');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

describe('ClienteDetailPage', () => {
  beforeEach(() => {
    resetClientesMocks();
    mockNavigate.mockClear();
  });

  it('shows loading state', () => {
    mockUseCliente.loading = true;

    renderWithRouter(<ClienteDetailPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const user = userEvent.setup();
    mockUseCliente.error = 'Cliente não encontrado';

    renderWithRouter(<ClienteDetailPage />);

    expect(screen.getByText('Cliente não encontrado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar para lista/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar para lista/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes');
  });

  it('shows not found when cliente is null', () => {
    mockUseCliente.cliente = null;

    renderWithRouter(<ClienteDetailPage />);

    expect(screen.getByText('Cliente não encontrado')).toBeInTheDocument();
  });

  it('displays client details', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
      dataNascimento: '2000-01-15',
      nomeCuidador: 'Maria Silva',
    };

    renderWithRouter(<ClienteDetailPage />);

    expect(screen.getByRole('heading', { name: 'João Silva' })).toBeInTheDocument();
    expect(screen.getByText('Detalhes do cliente')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText(SexoEnum.MASCULINO)).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
  });

  it('formats date in pt-BR format', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
      dataNascimento: '2000-01-15',
    };

    renderWithRouter(<ClienteDetailPage />);

    // Date should be formatted in pt-BR (dd/mm/yyyy)
    // Using flexible matcher due to timezone differences
    const dateText = screen.getByText(/\d{2}\/\d{2}\/2000/);
    expect(dateText).toBeInTheDocument();
  });

  it('shows dash when dataNascimento is not provided', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };

    renderWithRouter(<ClienteDetailPage />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('navigates to list when Voltar is clicked', async () => {
    const user = userEvent.setup();
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };

    renderWithRouter(<ClienteDetailPage />);

    await user.click(screen.getByRole('button', { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes');
  });

  it('navigates to edit page when Editar is clicked', async () => {
    const user = userEvent.setup();
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };

    renderWithRouter(<ClienteDetailPage />);

    await user.click(screen.getByRole('button', { name: /editar/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes/1/editar');
  });
});
