import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ConfirmModal } from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when escape key is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        Content
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        Content
      </Modal>
    );
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test"
        footer={<button>Footer Button</button>}
      >
        Content
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument();
  });

  it('does not render footer when footer prop is not provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        Content
      </Modal>
    );
    // Verify only the content is present, no buttons in the modal
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirmar Ação',
    message: 'Tem certeza?',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and message', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Confirmar Ação' })).toBeInTheDocument();
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument();
  });

  it('renders default button texts', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('renders custom button texts', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Excluir"
        cancelText="Voltar"
      />
    );
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isLoading is true', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aguarde...' })).toBeDisabled();
  });

  it('shows loading text when isLoading is true', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('button', { name: 'Aguarde...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument();
  });
});
