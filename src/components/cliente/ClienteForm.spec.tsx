import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClienteForm } from './ClienteForm';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import { ClienteDTO } from '../../application/dto/cliente.dto';

describe('ClienteForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty form in create mode', () => {
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText('Nome')).toHaveValue('');
    expect(screen.getByLabelText('Número de RG')).toHaveValue('');
    expect(screen.getByLabelText('Sexo')).toHaveValue(SexoEnum.OUTRO);
    expect(screen.getByLabelText('Data de Nascimento')).toHaveValue('');
    expect(screen.getByLabelText('Nome do Cuidador')).toHaveValue('');
  });

  it('populates form with initialData in edit mode', () => {
    const initialData: ClienteDTO = {
      id: '1',
      nome: 'João Silva',
      numeroRg: '123456789',
      sexo: SexoEnum.MASCULINO,
      dataNascimento: '2000-01-15',
      nomeCuidador: 'Maria Silva',
    };

    render(
      <ClienteForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Nome')).toHaveValue('João Silva');
    expect(screen.getByLabelText('Número de RG')).toHaveValue('123456789');
    expect(screen.getByLabelText('Sexo')).toHaveValue(SexoEnum.MASCULINO);
    expect(screen.getByLabelText('Data de Nascimento')).toHaveValue('2000-01-15');
    expect(screen.getByLabelText('Nome do Cuidador')).toHaveValue('Maria Silva');
  });

  it('prevents submission when nome is empty', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('prevents submission when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows error when dataNascimento is in the future', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Número de RG'), '123456789');

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const dateInput = screen.getByLabelText('Data de Nascimento');
    await user.clear(dateInput);
    await user.type(dateInput, futureDateStr);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Data de nascimento não pode estar no futuro')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data on valid submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText('Nome'), '  João Silva  ');
    await user.type(screen.getByLabelText('Número de RG'), '  123456789  ');
    await user.selectOptions(screen.getByLabelText('Sexo'), SexoEnum.MASCULINO);

    const dateInput = screen.getByLabelText('Data de Nascimento');
    await user.clear(dateInput);
    await user.type(dateInput, '2000-01-15');

    await user.type(screen.getByLabelText('Nome do Cuidador'), '  Maria  ');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nome: 'João Silva',
        numeroRg: '123456789',
        sexo: SexoEnum.MASCULINO,
        dataNascimento: '2000-01-15',
        nomeCuidador: 'Maria',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables all fields when isLoading is true', () => {
    render(
      <ClienteForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText('Nome')).toBeDisabled();
    expect(screen.getByLabelText('Número de RG')).toBeDisabled();
    expect(screen.getByLabelText('Sexo')).toBeDisabled();
    expect(screen.getByLabelText('Data de Nascimento')).toBeDisabled();
    expect(screen.getByLabelText('Nome do Cuidador')).toBeDisabled();
  });

  it('shows "Salvando..." text when isLoading is true', () => {
    render(
      <ClienteForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /salvando/i })).toBeInTheDocument();
  });

  it('does not include empty nomeCuidador in submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<ClienteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText('Nome'), 'João');
    await user.type(screen.getByLabelText('Número de RG'), '123456789');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          nomeCuidador: undefined,
        })
      );
    });
  });
});
