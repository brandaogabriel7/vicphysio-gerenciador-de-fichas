import Data from './data';

export default class DataNascimento {
  private _data: Data;

  constructor(dataNascimento: string | Date) {
    this._data = new Data(dataNascimento, 'Data de nascimento inválida');

    if (this._data.valor > new Date()) {
      throw new Error('Data de nascimento não pode estar no futuro');
    }
  }

  formatar(): string {
    return this._data.formatar();
  }

  get valor(): Date {
    return this._data.valor;
  }
}
