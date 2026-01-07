import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import { ClienteEditPage } from './ClienteEditPage';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import {
  mockUseCliente,
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
    useParams: () => ({ id: '1' }),
  };
});

describe('ClienteEditPage', () => {
  beforeEach(() => {
    resetClientesMocks();
    resetMutationsMocks();
    mockNavigate.mockClear();
  });

  it('shows loading state', () => {
    mockUseCliente.loading = true;

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const user = userEvent.setup();
    mockUseCliente.error = 'Erro ao carregar cliente';

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByText('Erro ao carregar cliente')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar para lista/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes');
  });

  it('shows not found when cliente is null', () => {
    mockUseCliente.cliente = null;

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByText('Cliente não encontrado')).toBeInTheDocument();
  });

  it('renders page header with client name', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByRole('heading', { name: 'Editar Cliente' })).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('populates form with client data', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
      dataNascimento: '2000-01-15',
    };

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByLabelText('Nome')).toHaveValue('João Silva');
    expect(screen.getByLabelText('Número de RG')).toHaveValue('123456789');
    expect(screen.getByLabelText('Sexo')).toHaveValue(SexoEnum.MASCULINO);
    expect(screen.getByLabelText('Data de Nascimento')).toHaveValue('2000-01-15');
  });

  it('shows error message when update fails', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };
    mockUseClienteMutations.error = 'Erro ao atualizar cliente';

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByText('Erro ao atualizar cliente')).toBeInTheDocument();
  });

  it('calls updateCliente and navigates on successful submission', async () => {
    const user = userEvent.setup();
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };
    mockUseClienteMutations.updateCliente.mockResolvedValueOnce(undefined);

    renderWithRouter(<ClienteEditPage />);

    // Clear and type new name
    await user.clear(screen.getByLabelText('Nome'));
    await user.type(screen.getByLabelText('Nome'), 'João Silva Updated');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUseClienteMutations.updateCliente).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          nome: 'João Silva Updated',
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/clientes/1');
    });
  });

  it('navigates back to detail when cancel is clicked', async () => {
    const user = userEvent.setup();
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };

    renderWithRouter(<ClienteEditPage />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes/1');
  });

  it('disables form when updating', () => {
    mockUseCliente.cliente = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
    };
    mockUseClienteMutations.loading = true;

    renderWithRouter(<ClienteEditPage />);

    expect(screen.getByLabelText('Nome')).toBeDisabled();
    expect(screen.getByLabelText('Número de RG')).toBeDisabled();
  });
});
