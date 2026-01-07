import { renderHook, waitFor, act } from '@testing-library/react';
import { useClienteMutations } from './useClienteMutations';
import { CreateClienteDTO, UpdateClienteDTO } from '../application/dto/cliente.dto';
import { SexoEnum } from '../domain/ficha/entity/enum/sexo';
import {
  mockClienteService,
  resetMocks,
} from '../services/__mocks__/cliente.service.factory';

vi.mock('../services/cliente.service.factory');

describe('useClienteMutations', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('createCliente', () => {
    const newCliente: CreateClienteDTO = {
      nome: 'João',
      numeroRg: '123',
      sexo: SexoEnum.MASCULINO,
    };

    it('sets loading to true during creation', async () => {
      let resolvePromise: () => void;
      vi.mocked(mockClienteService.create).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useClienteMutations());

      act(() => {
        result.current.createCliente(newCliente);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!();
      });

      expect(result.current.loading).toBe(false);
    });

    it('calls service create with correct data', async () => {
      vi.mocked(mockClienteService.create).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useClienteMutations());

      await act(async () => {
        await result.current.createCliente(newCliente);
      });

      expect(mockClienteService.create).toHaveBeenCalledWith(newCliente);
    });

    it('sets error on failure and throws', async () => {
      vi.mocked(mockClienteService.create).mockRejectedValueOnce(
        new Error('Erro ao criar cliente')
      );

      const { result } = renderHook(() => useClienteMutations());

      let thrownError: Error | undefined;
      await act(async () => {
        try {
          await result.current.createCliente(newCliente);
        } catch (e) {
          thrownError = e as Error;
        }
      });

      expect(thrownError?.message).toBe('Erro ao criar cliente');
      expect(result.current.error).toBe('Erro ao criar cliente');
      expect(result.current.loading).toBe(false);
    });

    it('clears error on successful creation', async () => {
      vi.mocked(mockClienteService.create)
        .mockRejectedValueOnce(new Error('Erro'))
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useClienteMutations());

      await act(async () => {
        try {
          await result.current.createCliente(newCliente);
        } catch {
          // expected
        }
      });

      expect(result.current.error).toBe('Erro');

      await act(async () => {
        await result.current.createCliente(newCliente);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('updateCliente', () => {
    const updateData: UpdateClienteDTO = {
      id: '1',
      nome: 'João Atualizado',
      numeroRg: '123',
      sexo: SexoEnum.MASCULINO,
    };

    it('sets loading to true during update', async () => {
      let resolvePromise: () => void;
      vi.mocked(mockClienteService.update).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useClienteMutations());

      act(() => {
        result.current.updateCliente(updateData);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!();
      });

      expect(result.current.loading).toBe(false);
    });

    it('calls service update with correct data', async () => {
      vi.mocked(mockClienteService.update).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useClienteMutations());

      await act(async () => {
        await result.current.updateCliente(updateData);
      });

      expect(mockClienteService.update).toHaveBeenCalledWith(updateData);
    });

    it('sets error on failure and throws', async () => {
      vi.mocked(mockClienteService.update).mockRejectedValueOnce(
        new Error('Erro ao atualizar cliente')
      );

      const { result } = renderHook(() => useClienteMutations());

      let thrownError: Error | undefined;
      await act(async () => {
        try {
          await result.current.updateCliente(updateData);
        } catch (e) {
          thrownError = e as Error;
        }
      });

      expect(thrownError?.message).toBe('Erro ao atualizar cliente');
      expect(result.current.error).toBe('Erro ao atualizar cliente');
    });
  });

  describe('deleteCliente', () => {
    it('sets loading to true during deletion', async () => {
      let resolvePromise: () => void;
      vi.mocked(mockClienteService.delete).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useClienteMutations());

      act(() => {
        result.current.deleteCliente('1');
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!();
      });

      expect(result.current.loading).toBe(false);
    });

    it('calls service delete with correct id', async () => {
      vi.mocked(mockClienteService.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useClienteMutations());

      await act(async () => {
        await result.current.deleteCliente('123');
      });

      expect(mockClienteService.delete).toHaveBeenCalledWith('123');
    });

    it('sets error on failure and throws', async () => {
      vi.mocked(mockClienteService.delete).mockRejectedValueOnce(
        new Error('Erro ao excluir cliente')
      );

      const { result } = renderHook(() => useClienteMutations());

      let thrownError: Error | undefined;
      await act(async () => {
        try {
          await result.current.deleteCliente('1');
        } catch (e) {
          thrownError = e as Error;
        }
      });

      expect(thrownError?.message).toBe('Erro ao excluir cliente');
      expect(result.current.error).toBe('Erro ao excluir cliente');
    });
  });
});
