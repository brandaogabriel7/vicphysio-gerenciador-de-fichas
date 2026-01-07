import { vi } from 'vitest';
import { ClienteDTO } from '../../application/dto/cliente.dto';

export const mockUseClientes = {
  clientes: [] as ClienteDTO[],
  loading: false,
  error: null as string | null,
  refetch: vi.fn(),
};

export const mockUseCliente = {
  cliente: null as ClienteDTO | null,
  loading: false,
  error: null as string | null,
};

export const useClientes = vi.fn(() => mockUseClientes);
export const useCliente = vi.fn(() => mockUseCliente);

export function resetMocks() {
  mockUseClientes.clientes = [];
  mockUseClientes.loading = false;
  mockUseClientes.error = null;
  mockUseClientes.refetch.mockReset();

  mockUseCliente.cliente = null;
  mockUseCliente.loading = false;
  mockUseCliente.error = null;

  useClientes.mockClear();
  useCliente.mockClear();
}
