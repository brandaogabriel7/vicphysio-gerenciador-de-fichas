import { toISODateOnlyString } from '../../../utils/date-utils';

export default class DataNascimento {
  private _valor: Date;

  constructor(dataNascimento: string | Date) {
    if (!dataNascimento) {
      throw new Error('Data de nascimento é obrigatória');
    }

    this._valor = new Date(dataNascimento);

    if (isNaN(this._valor.getTime())) {
      throw new Error('Data de nascimento inválida');
    }

    if (this._valor > new Date()) {
      throw new Error('Data de nascimento não pode estar no futuro');
    }
  }

  get valor(): string {
    return toISODateOnlyString(this._valor);
  }
}
