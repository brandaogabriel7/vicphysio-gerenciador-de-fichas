import { ClienteDTO, CreateClienteDTO, UpdateClienteDTO } from '../application/dto/cliente.dto';

export interface ClienteService {
  findAll(): Promise<ClienteDTO[]>;
  find(id: string): Promise<ClienteDTO>;
  create(data: CreateClienteDTO): Promise<void>;
  update(data: UpdateClienteDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

export class ElectronClienteService implements ClienteService {
  async findAll(): Promise<ClienteDTO[]> {
    return window.clienteApi.findAll();
  }

  async find(id: string): Promise<ClienteDTO> {
    return window.clienteApi.find(id);
  }

  async create(data: CreateClienteDTO): Promise<void> {
    return window.clienteApi.create(data);
  }

  async update(data: UpdateClienteDTO): Promise<void> {
    return window.clienteApi.update(data);
  }

  async delete(id: string): Promise<void> {
    return window.clienteApi.delete(id);
  }
}

export class WebClienteService implements ClienteService {
  async findAll(): Promise<ClienteDTO[]> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(_id: string): Promise<ClienteDTO> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_data: CreateClienteDTO): Promise<void> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(_data: UpdateClienteDTO): Promise<void> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_id: string): Promise<void> {
    throw new Error('Web service not implemented yet');
  }
}
