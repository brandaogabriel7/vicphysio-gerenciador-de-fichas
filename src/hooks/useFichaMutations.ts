import { useState, useCallback, useMemo } from 'react';
import { CreateFichaDTO, UpdateFichaDTO } from '../application/dto/ficha.dto';
import { createFichaService } from '../services/ficha.service.factory';

export function useFichaMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createFichaService(), []);

  const createFicha = useCallback(async (data: CreateFichaDTO) => {
    try {
      setLoading(true);
      setError(null);
      await service.create(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ficha';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const updateFicha = useCallback(async (data: UpdateFichaDTO) => {
    try {
      setLoading(true);
      setError(null);
      await service.update(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ficha';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const deleteFicha = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await service.delete(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir ficha';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    createFicha,
    updateFicha,
    deleteFicha,
    loading,
    error,
  };
}
