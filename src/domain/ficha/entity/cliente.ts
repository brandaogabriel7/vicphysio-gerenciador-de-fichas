import DataNascimento from '../value-object/data-nascimento';
import { Sexo, SexoEnum } from './enum/sexo';

export default class Cliente {
  private _id: string;
  private _nome: string;
  private _numeroRg: string;
  private _sexo: Sexo = SexoEnum.OUTRO;
  private _dataNascimento?: DataNascimento;
  private _nomeCuidador?: string;

  constructor(
    id: string,
    nome: string,
    numeroRg: string,
    sexo: Sexo = SexoEnum.OUTRO,
    dataNascimento?: DataNascimento,
    nomeCuidador?: string
  ) {
    this._id = id;
    this._nome = nome;
    this._numeroRg = numeroRg;
    this._sexo = sexo;
    this._dataNascimento = dataNascimento;
    this._nomeCuidador = nomeCuidador;

    this._validate();
  }

  private _validate() {
    if (!this._id) {
      throw new Error('Id é obrigatório');
    }

    if (!this._nome) {
      throw new Error('Nome é obrigatório');
    }

    if (!this._numeroRg) {
      throw new Error('Número de RG é obrigatório');
    }
  }

  alterarNome(nome: string) {
    this._nome = nome;

    this._validate();
  }

  alterarRg(numeroRg: string) {
    this._numeroRg = numeroRg;

    this._validate();
  }

  alterarSexo(sexo: Sexo) {
    this._sexo = sexo;
  }

  alterarDataNascimento(dataNascimento: DataNascimento) {
    this._dataNascimento = dataNascimento;
  }

  alterarNomeCuidador(nomeCuidador: string) {
    this._nomeCuidador = nomeCuidador;
  }

  get id() {
    return this._id;
  }

  get nome() {
    return this._nome;
  }

  get numeroRg() {
    return this._numeroRg;
  }

  get sexo() {
    return this._sexo;
  }

  get dataNascimento() {
    return this._dataNascimento;
  }

  get nomeCuidador() {
    return this._nomeCuidador;
  }
}
