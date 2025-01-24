export default class Altura {
  constructor(private _valor: number) {
    if (_valor <= 0) {
      throw new Error('Altura inválida');
    }
  }

  get valor(): number {
    return this._valor;
  }

  formatar(): string {
    return `${this._valor.toLocaleString('pt-BR', {
      maximumFractionDigits: 2,
    })}m`;
  }
}
