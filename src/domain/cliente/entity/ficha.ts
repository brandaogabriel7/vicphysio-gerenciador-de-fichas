import DataGenerica from '../value-object/data-generica';
import Cliente from './cliente';
import { HistoriaPatologicaPregressa } from './enum/historia-patologica-pregressa';
import { QualidadeAlimentacao } from './enum/qualidade-alimentacao';

export default class Ficha {
  private _id: string;
  private _cliente: Cliente;
  private _data?: DataGenerica;

  private _historiaMolestiaAtual?: string;
  private _historiasPatologicasPregressas: Set<HistoriaPatologicaPregressa> =
    new Set<HistoriaPatologicaPregressa>();
  private _qualidadeAlimentacao?: QualidadeAlimentacao;
  private _medicacoes?: string;
  private _observacoes?: string;

  constructor(id: string, cliente: Cliente) {
    if (!id) {
      throw new Error('id é obrigatório');
    }

    this._id = id;
    this._cliente = cliente;
  }

  get id(): string {
    return this._id;
  }

  get cliente(): Cliente {
    return this._cliente;
  }

  get data(): DataGenerica | undefined {
    return this._data;
  }

  get historiaMolestiaAtual(): string | undefined {
    return this._historiaMolestiaAtual;
  }

  get qualidadeAlimentacao(): QualidadeAlimentacao | undefined {
    return this._qualidadeAlimentacao;
  }

  get medicacoes(): string | undefined {
    return this._medicacoes;
  }

  get observacoes(): string | undefined {
    return this._observacoes;
  }

  get historiasPatologicasPregressas(): HistoriaPatologicaPregressa[] {
    return Array.from(this._historiasPatologicasPregressas);
  }

  alterarDataFicha(data: DataGenerica): void {
    this._data = data;
  }

  alterarHistoriaMolestiaAtual(historiaMolestiaAtual: string): void {
    this._historiaMolestiaAtual = historiaMolestiaAtual;
  }

  alterarQualidadeAlimentacao(
    qualidadeAlimentacao: QualidadeAlimentacao
  ): void {
    this._qualidadeAlimentacao = qualidadeAlimentacao;
  }

  alterarMedicacoes(medicacoes: string): void {
    this._medicacoes = medicacoes;
  }

  alterarObservacoes(observacoes: string): void {
    this._observacoes = observacoes;
  }

  adicionarHistoriaPatologicaPregressa(
    historiaPatologicaPregressa: HistoriaPatologicaPregressa
  ): void {
    this._historiasPatologicasPregressas.add(historiaPatologicaPregressa);
  }

  removerHistoriaPatologicaPregressa(
    historiaPatologicaPregressa: HistoriaPatologicaPregressa
  ): void {
    this._historiasPatologicasPregressas.delete(historiaPatologicaPregressa);
  }
}
