import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import { ClienteCreatePage } from './ClienteCreatePage';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import {
  mockUseClienteMutations,
  resetMocks as resetMutationsMocks,
} from '../../hooks/__mocks__/useClienteMutations';

vi.mock('../../hooks/useClienteMutations');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ClienteCreatePage', () => {
  beforeEach(() => {
    resetMutationsMocks();
    mockNavigate.mockClear();
  });

  it('renders page header', () => {
    renderWithRouter(<ClienteCreatePage />);

    expect(screen.getByRole('heading', { name: 'Novo Cliente' })).toBeInTheDocument();
    expect(screen.getByText('Preencha os dados do cliente')).toBeInTheDocument();
  });

  it('renders empty form', () => {
    renderWithRouter(<ClienteCreatePage />);

    expect(screen.getByLabelText('Nome')).toHaveValue('');
    expect(screen.getByLabelText('Número de RG')).toHaveValue('');
  });

  it('shows error message when creation fails', () => {
    mockUseClienteMutations.error = 'Erro ao criar cliente';

    renderWithRouter(<ClienteCreatePage />);

    expect(screen.getByText('Erro ao criar cliente')).toBeInTheDocument();
  });

  it('calls createCliente and navigates on successful submission', async () => {
    const user = userEvent.setup();
    mockUseClienteMutations.createCliente.mockResolvedValueOnce(undefined);

    renderWithRouter(<ClienteCreatePage />);

    await user.type(screen.getByLabelText('Nome'), 'João Silva');
    await user.type(screen.getByLabelText('Número de RG'), '123456789');
    await user.selectOptions(screen.getByLabelText('Sexo'), SexoEnum.MASCULINO);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUseClienteMutations.createCliente).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'João Silva',
          numeroRg: '123456789',
          sexo: SexoEnum.MASCULINO,
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/clientes');
    });
  });

  it('navigates back when cancel is clicked', async () => {
    const user = userEvent.setup();

    renderWithRouter(<ClienteCreatePage />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/clientes');
  });

  it('disables form when loading', () => {
    mockUseClienteMutations.loading = true;

    renderWithRouter(<ClienteCreatePage />);

    expect(screen.getByLabelText('Nome')).toBeDisabled();
    expect(screen.getByLabelText('Número de RG')).toBeDisabled();
  });
});
