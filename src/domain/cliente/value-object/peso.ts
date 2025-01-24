export default class Peso {
  constructor(private _valor: number) {
    if (_valor <= 0) {
      throw new Error('Peso inválido');
    }
  }

  get valor(): number {
    return this._valor;
  }

  formatar(): string {
    return `${this._valor}kg`;
  }
}
