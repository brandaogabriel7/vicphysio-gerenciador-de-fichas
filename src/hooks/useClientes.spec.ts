import { renderHook, waitFor } from '@testing-library/react';
import { useClientes, useCliente } from './useClientes';
import { ClienteDTO } from '../application/dto/cliente.dto';
import { SexoEnum } from '../domain/ficha/entity/enum/sexo';
import {
  mockClienteService,
  resetMocks,
} from '../services/__mocks__/cliente.service.factory';

vi.mock('../services/cliente.service.factory');

describe('useClientes', () => {
  beforeEach(() => {
    resetMocks();
  });

  const mockClientes: ClienteDTO[] = [
    {
      id: '1',
      nome: 'João',
      numeroRg: '123',
      sexo: SexoEnum.MASCULINO,
    },
    {
      id: '2',
      nome: 'Maria',
      numeroRg: '456',
      sexo: SexoEnum.FEMININO,
    },
  ];

  it('fetches clientes on mount', async () => {
    vi.mocked(mockClienteService.findAll).mockResolvedValueOnce(mockClientes);

    const { result } = renderHook(() => useClientes());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.clientes).toEqual(mockClientes);
    expect(result.current.error).toBeNull();
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(mockClienteService.findAll).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useClientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.clientes).toEqual([]);
  });

  it('refetch function fetches clientes again', async () => {
    vi.mocked(mockClienteService.findAll)
      .mockResolvedValueOnce([mockClientes[0]])
      .mockResolvedValueOnce(mockClientes);

    const { result } = renderHook(() => useClientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.clientes).toHaveLength(1);

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.clientes).toHaveLength(2);
    });
  });
});

describe('useCliente', () => {
  beforeEach(() => {
    resetMocks();
  });

  const mockCliente: ClienteDTO = {
    id: '1',
    nome: 'João',
    numeroRg: '123',
    sexo: SexoEnum.MASCULINO,
  };

  it('does not fetch when id is undefined', async () => {
    const { result } = renderHook(() => useCliente(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockClienteService.find).not.toHaveBeenCalled();
    expect(result.current.cliente).toBeNull();
  });

  it('fetches cliente when id is provided', async () => {
    vi.mocked(mockClienteService.find).mockResolvedValueOnce(mockCliente);

    const { result } = renderHook(() => useCliente('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cliente).toEqual(mockCliente);
    expect(result.current.error).toBeNull();
    expect(mockClienteService.find).toHaveBeenCalledWith('1');
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(mockClienteService.find).mockRejectedValueOnce(
      new Error('Cliente não encontrado')
    );

    const { result } = renderHook(() => useCliente('999'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Cliente não encontrado');
    expect(result.current.cliente).toBeNull();
  });

  it('refetches when id changes', async () => {
    vi.mocked(mockClienteService.find)
      .mockResolvedValueOnce(mockCliente)
      .mockResolvedValueOnce({ ...mockCliente, id: '2', nome: 'Maria' });

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useCliente(id),
      { initialProps: { id: '1' } }
    );

    await waitFor(() => {
      expect(result.current.cliente?.nome).toBe('João');
    });

    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.cliente?.nome).toBe('Maria');
    });
  });
});
