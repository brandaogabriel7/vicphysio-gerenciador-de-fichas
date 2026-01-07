import { ClienteDTO, CreateClienteDTO, UpdateClienteDTO } from '../application/dto/cliente.dto';

export interface ClienteApi {
  findAll(): Promise<ClienteDTO[]>;
  find(id: string): Promise<ClienteDTO>;
  create(data: CreateClienteDTO): Promise<void>;
  update(data: UpdateClienteDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

declare global {
  interface Window {
    clienteApi: ClienteApi;
    ipcRenderer: {
      on(channel: string, listener: (event: unknown, ...args: unknown[]) => void): void;
      off(channel: string, listener: (...args: unknown[]) => void): void;
      send(channel: string, ...args: unknown[]): void;
      invoke(channel: string, ...args: unknown[]): Promise<unknown>;
    };
  }
}

export {};
