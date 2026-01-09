import { useState, useEffect, useCallback, useMemo } from 'react';
import { FichaDTO } from '../application/dto/ficha.dto';
import { createFichaService } from '../services/ficha.service.factory';

export function useFichas() {
  const [fichas, setFichas] = useState<FichaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createFichaService(), []);

  const fetchFichas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.findAll();
      setFichas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fichas');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchFichas();
  }, [fetchFichas]);

  return { fichas, loading, error, refetch: fetchFichas };
}

export function useFichasByCliente(clienteId: string | undefined) {
  const [fichas, setFichas] = useState<FichaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createFichaService(), []);

  const fetchFichas = useCallback(async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await service.findByCliente(clienteId);
      setFichas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fichas');
    } finally {
      setLoading(false);
    }
  }, [clienteId, service]);

  useEffect(() => {
    fetchFichas();
  }, [fetchFichas]);

  return { fichas, loading, error, refetch: fetchFichas };
}

export function useFicha(id: string | undefined) {
  const [ficha, setFicha] = useState<FichaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createFichaService(), []);

  const fetchFicha = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await service.find(id);
      setFicha(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ficha');
    } finally {
      setLoading(false);
    }
  }, [id, service]);

  useEffect(() => {
    fetchFicha();
  }, [fetchFicha]);

  return { ficha, loading, error, refetch: fetchFicha };
}
