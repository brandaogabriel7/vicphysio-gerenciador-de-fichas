import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Nome" />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="Data de Nascimento" />);
    const input = screen.getByLabelText('Data de Nascimento');
    expect(input).toHaveAttribute('id', 'data-de-nascimento');
  });

  it('uses custom id when provided', () => {
    render(<Input label="Nome" id="custom-id" />);
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('displays error message', () => {
    render(<Input label="Nome" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('applies error styling when error exists', () => {
    render(<Input label="Nome" error="Error" />);
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles disabled state', () => {
    render(<Input label="Nome" disabled />);
    const input = screen.getByLabelText('Nome');
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Nome" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('triggers onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input label="Nome" onChange={handleChange} />);
    const input = screen.getByLabelText('Nome');
    await user.type(input, 'Test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders different input types', () => {
    render(<Input label="Data" type="date" />);
    const input = screen.getByLabelText('Data');
    expect(input).toHaveAttribute('type', 'date');
  });
});
