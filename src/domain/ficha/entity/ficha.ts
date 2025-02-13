import CamposFichaFisioterapia from '../value-object/campos-ficha-fisioterapia';
import CamposFichaPilates from '../value-object/campos-ficha-pilates';
import Data from '../value-object/data';
import Cliente from './cliente';
import { HistoriaPatologicaPregressa } from './enum/historia-patologica-pregressa';
import { QualidadeAlimentacao } from './enum/qualidade-alimentacao';
import { TipoFicha, TipoFichaEnum } from './enum/tipo-ficha';

export default class Ficha {
  private _id: string;
  private _cliente: Cliente;
  private _data?: Data;

  private _historiaMolestiaAtual?: string;
  private _historiasPatologicasPregressas: Set<HistoriaPatologicaPregressa> =
    new Set<HistoriaPatologicaPregressa>();
  private _qualidadeAlimentacao?: QualidadeAlimentacao;
  private _medicacoes?: string;
  private _observacoes?: string;
  private _tipoFicha: TipoFicha = TipoFichaEnum.NAO_ESPECIFICADO;

  private _camposEspecificosPilates = new CamposFichaPilates({});
  private _camposEspecificosFisioterapia = new CamposFichaFisioterapia({});

  constructor(id: string, cliente: Cliente, tipoFicha?: TipoFicha) {
    if (!id) {
      throw new Error('id é obrigatório');
    }

    this._id = id;
    this._cliente = cliente;
    this._tipoFicha = tipoFicha || this._tipoFicha;
  }

  get id(): string {
    return this._id;
  }

  get cliente(): Cliente {
    return this._cliente;
  }

  get tipoFicha(): TipoFicha {
    return this._tipoFicha;
  }

  get data(): Data | undefined {
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

  get camposEspecificos():
    | CamposFichaPilates
    | CamposFichaFisioterapia
    | object {
    if (this._tipoFicha === TipoFichaEnum.NAO_ESPECIFICADO) {
      return {};
    }

    if (this._tipoFicha === TipoFichaEnum.PILATES) {
      return this._camposEspecificosPilates;
    }

    return this._camposEspecificosFisioterapia;
  }

  alterarDataFicha(data: Data): void {
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

  alterarTipoFicha(tipoFicha: TipoFicha): void {
    this._tipoFicha = tipoFicha;
  }

  preencherCamposEspecificos(
    campos: CamposFichaPilates | CamposFichaFisioterapia | object
  ): void {
    if (this.tipoFicha === TipoFichaEnum.NAO_ESPECIFICADO) {
      throw new Error('Tipo de ficha não especificado');
    }

    if (this._tipoFicha === TipoFichaEnum.PILATES) {
      this._camposEspecificosPilates = campos as CamposFichaPilates;
    } else {
      this._camposEspecificosFisioterapia = campos as CamposFichaFisioterapia;
    }
  }
}
