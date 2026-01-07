import { useState, useCallback, useMemo } from 'react';
import { CreateClienteDTO, UpdateClienteDTO } from '../application/dto/cliente.dto';
import { createClienteService } from '../services/cliente.service.factory';

export function useClienteMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createClienteService(), []);

  const createCliente = useCallback(async (data: CreateClienteDTO) => {
    try {
      setLoading(true);
      setError(null);
      await service.create(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const updateCliente = useCallback(async (data: UpdateClienteDTO) => {
    try {
      setLoading(true);
      setError(null);
      await service.update(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const deleteCliente = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await service.delete(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    createCliente,
    updateCliente,
    deleteCliente,
    loading,
    error,
  };
}
