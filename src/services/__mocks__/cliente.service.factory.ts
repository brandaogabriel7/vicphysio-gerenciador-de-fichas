import { vi } from 'vitest';
import { ClienteService } from '../cliente.service';

export const mockClienteService: ClienteService = {
  findAll: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

export const createClienteService = vi.fn(() => mockClienteService);

export const resetMocks = () => {
  vi.mocked(mockClienteService.findAll).mockReset();
  vi.mocked(mockClienteService.find).mockReset();
  vi.mocked(mockClienteService.create).mockReset();
  vi.mocked(mockClienteService.update).mockReset();
  vi.mocked(mockClienteService.delete).mockReset();
  vi.mocked(createClienteService).mockClear();
};
