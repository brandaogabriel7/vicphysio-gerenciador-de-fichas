export default class NumeroTelefone {
  constructor(private _valor: string) {
    this._validate();
  }

  get valor(): string {
    return this._valor;
  }

  private _validate() {
    if (!this._valor) {
      throw new Error('Número de telefone é obrigatório');
    }

    const telefone = this._valor.replace(/\D/g, '');

    if (!/^\d{10,11}$/.test(telefone)) {
      throw new Error('Número de telefone inválido');
    }
  }
}
