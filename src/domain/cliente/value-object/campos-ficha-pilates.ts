import Altura from './altura';
import Peso from './peso';

export default class CamposFichaPilates {
  private _peso?: Peso;
  private _altura?: Altura;

  constructor({ peso, altura }: { peso?: number; altura?: number }) {
    this._peso = peso ? new Peso(peso) : undefined;
    this._altura = altura ? new Altura(altura) : undefined;
  }

  get peso(): Peso | undefined {
    return this._peso;
  }

  get altura(): Altura | undefined {
    return this._altura;
  }
}
