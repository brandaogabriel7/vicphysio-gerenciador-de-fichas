import Altura from './altura';
import Peso from './peso';

export default class CamposFichaPilates {
  private _peso: Peso;
  private _altura: Altura;

  constructor({ peso, altura }: { peso: number; altura: number }) {
    this._peso = new Peso(peso);
    this._altura = new Altura(altura);
  }

  get peso(): Peso {
    return this._peso;
  }

  get altura(): Altura {
    return this._altura;
  }
}
