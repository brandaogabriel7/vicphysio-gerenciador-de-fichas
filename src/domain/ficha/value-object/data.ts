import { toISODateOnlyString } from '../../../utils/date-utils';

export default class Data {
  private _valor: Date;

  constructor(data: string | Date, mensagemErro = 'Data inválida') {
    if (!data) {
      throw new Error('Data de nascimento é obrigatória');
    }

    this._valor = new Date(data);

    if (isNaN(this._valor.getTime())) {
      throw new Error(mensagemErro);
    }
  }

  formatar(): string {
    return toISODateOnlyString(this._valor);
  }

  get valor(): Date {
    return this._valor;
  }
}
