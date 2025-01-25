export default class Oxigenacao {
  private _valor: number;

  constructor(oxigenacao: number) {
    this._valor = oxigenacao;
  }

  get valor(): number {
    return this._valor;
  }

  formatar(): string {
    return `${this._valor}%`;
  }
}
