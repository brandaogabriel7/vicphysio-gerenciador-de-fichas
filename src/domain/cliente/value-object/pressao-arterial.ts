export default class PressaoArterial {
  private _valorDiastolica: number;
  private _valorSistolica: number;

  constructor({
    valorDiastolica,
    valorSistolica,
  }: {
    valorDiastolica: number;
    valorSistolica: number;
  }) {
    this._valorDiastolica = valorDiastolica;
    this._valorSistolica = valorSistolica;
  }

  get valorDiastolica(): number {
    return this._valorDiastolica;
  }

  get valorSistolica(): number {
    return this._valorSistolica;
  }

  formatar(): string {
    return `${this._valorSistolica}/${this._valorDiastolica}mmHg`;
  }
}
