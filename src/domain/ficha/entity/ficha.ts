import DataGenerica from '../value-object/data-generica';
import Cliente from './cliente';

export default class Ficha {
  private _id: string;
  private _cliente: Cliente;
  private _data?: DataGenerica;

  constructor(id: string, cliente: Cliente, data?: DataGenerica) {
    if (!id) {
      throw new Error('id é obrigatório');
    }

    this._id = id;
    this._cliente = cliente;
    this._data = data;
  }

  get id(): string {
    return this._id;
  }

  get cliente(): Cliente {
    return this._cliente;
  }

  get data(): DataGenerica | undefined {
    return this._data;
  }

  alterarDataFicha(data: DataGenerica): void {
    this._data = data;
  }
}
