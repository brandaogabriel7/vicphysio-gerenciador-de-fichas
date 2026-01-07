import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClienteDTO } from '../application/dto/cliente.dto';
import { createClienteService } from '../services/cliente.service.factory';

export function useClientes() {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createClienteService(), []);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.findAll();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return { clientes, loading, error, refetch: fetchClientes };
}

export function useCliente(id: string | undefined) {
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createClienteService(), []);

  const fetchCliente = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await service.find(id);
      setCliente(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  }, [id, service]);

  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  return { cliente, loading, error, refetch: fetchCliente };
}
