import { vi } from 'vitest';

export const mockUseClienteMutations = {
  createCliente: vi.fn(),
  updateCliente: vi.fn(),
  deleteCliente: vi.fn(),
  loading: false,
  error: null as string | null,
};

export const useClienteMutations = vi.fn(() => mockUseClienteMutations);

export function resetMocks() {
  mockUseClienteMutations.createCliente.mockReset();
  mockUseClienteMutations.updateCliente.mockReset();
  mockUseClienteMutations.deleteCliente.mockReset();
  mockUseClienteMutations.loading = false;
  mockUseClienteMutations.error = null;

  useClienteMutations.mockClear();
}
