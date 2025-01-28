export default class FrequenciaRespiratoria {
  private _valor: number;

  constructor(frequenciaRespiratoria: number) {
    this._valor = frequenciaRespiratoria;
  }

  get valor(): number {
    return this._valor;
  }

  formatar(): string {
    return `${this._valor}irpm`;
  }
}
