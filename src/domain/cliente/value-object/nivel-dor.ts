export default class NivelDor {
  private _valor: number;

  constructor(nivelDor: number) {
    if (nivelDor < 0 || nivelDor > 10) {
      throw new Error('Nível de dor inválido');
    }

    this._valor = nivelDor;
  }

  get valor(): number {
    return this._valor;
  }
}
