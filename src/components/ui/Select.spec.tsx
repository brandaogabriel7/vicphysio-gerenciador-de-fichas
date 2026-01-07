import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Select } from './Select';

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Sexo" options={options} />);
    expect(screen.getByLabelText('Sexo')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Select label="Tipo de Ficha" options={options} />);
    const select = screen.getByLabelText('Tipo de Ficha');
    expect(select).toHaveAttribute('id', 'tipo-de-ficha');
  });

  it('renders placeholder option when provided', () => {
    render(<Select options={options} placeholder="Selecione uma opção" />);
    expect(screen.getByRole('option', { name: 'Selecione uma opção' })).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select options={options} error="Seleção obrigatória" />);
    expect(screen.getByText('Seleção obrigatória')).toBeInTheDocument();
  });

  it('applies error styling when error exists', () => {
    render(<Select label="Sexo" options={options} error="Error" />);
    const select = screen.getByLabelText('Sexo');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles disabled state', () => {
    render(<Select label="Sexo" options={options} disabled />);
    const select = screen.getByLabelText('Sexo');
    expect(select).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select options={options} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('triggers onChange when selection changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label="Sexo" options={options} onChange={handleChange} />);
    const select = screen.getByLabelText('Sexo');
    await user.selectOptions(select, 'opt2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('uses custom id when provided', () => {
    render(<Select label="Sexo" options={options} id="custom-select" />);
    const select = screen.getByLabelText('Sexo');
    expect(select).toHaveAttribute('id', 'custom-select');
  });
});
