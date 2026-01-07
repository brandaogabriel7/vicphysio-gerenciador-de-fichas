import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Clientes" />);
    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Clientes" subtitle="Lista de clientes cadastrados" />);
    expect(screen.getByText('Lista de clientes cadastrados')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Clientes" />);
    // Only the heading should be present, no subtitle text
    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    // No paragraph text should exist
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Clientes"
        actions={<button>Novo Cliente</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Novo Cliente' })).toBeInTheDocument();
  });

  it('does not render actions when actions not provided', () => {
    render(<PageHeader title="Clientes" />);
    // Only heading should be present, no action buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders multiple actions', () => {
    render(
      <PageHeader
        title="Cliente"
        actions={
          <>
            <button>Voltar</button>
            <button>Editar</button>
          </>
        }
      />
    );
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('renders title as h1 heading', () => {
    render(<PageHeader title="Clientes" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Clientes');
  });
});
