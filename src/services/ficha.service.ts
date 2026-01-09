import { FichaDTO, CreateFichaDTO, UpdateFichaDTO } from '../application/dto/ficha.dto';

export interface FichaService {
  findAll(): Promise<FichaDTO[]>;
  findByCliente(clienteId: string): Promise<FichaDTO[]>;
  find(id: string): Promise<FichaDTO>;
  create(data: CreateFichaDTO): Promise<void>;
  update(data: UpdateFichaDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

export class ElectronFichaService implements FichaService {
  async findAll(): Promise<FichaDTO[]> {
    return window.fichaApi.findAll();
  }

  async findByCliente(clienteId: string): Promise<FichaDTO[]> {
    return window.fichaApi.findByCliente(clienteId);
  }

  async find(id: string): Promise<FichaDTO> {
    return window.fichaApi.find(id);
  }

  async create(data: CreateFichaDTO): Promise<void> {
    return window.fichaApi.create(data);
  }

  async update(data: UpdateFichaDTO): Promise<void> {
    return window.fichaApi.update(data);
  }

  async delete(id: string): Promise<void> {
    return window.fichaApi.delete(id);
  }
}

export class WebFichaService implements FichaService {
  async findAll(): Promise<FichaDTO[]> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByCliente(_clienteId: string): Promise<FichaDTO[]> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(_id: string): Promise<FichaDTO> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_data: CreateFichaDTO): Promise<void> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(_data: UpdateFichaDTO): Promise<void> {
    throw new Error('Web service not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_id: string): Promise<void> {
    throw new Error('Web service not implemented yet');
  }
}
