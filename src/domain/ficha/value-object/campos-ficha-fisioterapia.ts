import FrequenciaRespiratoria from './frequencia-respiratoria';
import NivelDor from './nivel-dor';
import Oxigenacao from './oxigenacao';
import PressaoArterial from './pressao-arterial';

export default class CamposFichaFisioterapia {
  private _testesReflexos?: string;
  private _palpacao?: string;
  private _nivelDor?: NivelDor;
  private _inspecaoGeral?: string;
  private _movimentosAtivosPassivos?: string;
  private _classificacaoInternacionalDeFuncionalidade?: string;
  private _objetivoTerapeutico?: string;
  private _frequenciaRespiratoria?: FrequenciaRespiratoria;
  private _pressaoArterial?: PressaoArterial;
  private _oxigenacao?: Oxigenacao;
  private _autorizaUsoImagem?: boolean;
  private _outros?: string;

  constructor({
    testesReflexos,
    palpacao,
    nivelDor,
    inspecaoGeral,
    movimentosAtivosPassivos,
    classificacaoInternacionalDeFuncionalidade,
    objetivoTerapeutico,
    frequenciaRespiratoria,
    pressaoArterial,
    oxigenacao,
    autorizaUsoImagem,
    outros,
  }: {
    testesReflexos?: string;
    palpacao?: string;
    nivelDor?: number;
    inspecaoGeral?: string;
    movimentosAtivosPassivos?: string;
    classificacaoInternacionalDeFuncionalidade?: string;
    objetivoTerapeutico?: string;
    frequenciaRespiratoria?: number;
    pressaoArterial?: {
      valorSistolica: number;
      valorDiastolica: number;
    };
    oxigenacao?: number;
    autorizaUsoImagem?: boolean;
    outros?: string;
  } = {}) {
    this._testesReflexos = testesReflexos;
    this._palpacao = palpacao;
    this._nivelDor = nivelDor ? new NivelDor(nivelDor) : undefined;
    this._inspecaoGeral = inspecaoGeral;
    this._movimentosAtivosPassivos = movimentosAtivosPassivos;
    this._classificacaoInternacionalDeFuncionalidade =
      classificacaoInternacionalDeFuncionalidade;
    this._objetivoTerapeutico = objetivoTerapeutico;
    this._frequenciaRespiratoria = frequenciaRespiratoria
      ? new FrequenciaRespiratoria(frequenciaRespiratoria)
      : undefined;
    this._pressaoArterial = pressaoArterial
      ? new PressaoArterial(pressaoArterial)
      : undefined;
    this._oxigenacao = oxigenacao ? new Oxigenacao(oxigenacao) : undefined;
    this._autorizaUsoImagem = autorizaUsoImagem;
    this._outros = outros;
  }

  get testesReflexos(): string | undefined {
    return this._testesReflexos;
  }

  get palpacao(): string | undefined {
    return this._palpacao;
  }

  get nivelDor(): NivelDor | undefined {
    return this._nivelDor;
  }

  get inspecaoGeral(): string | undefined {
    return this._inspecaoGeral;
  }

  get movimentosAtivosPassivos(): string | undefined {
    return this._movimentosAtivosPassivos;
  }

  get classificacaoInternacionalDeFuncionalidade(): string | undefined {
    return this._classificacaoInternacionalDeFuncionalidade;
  }

  get objetivoTerapeutico(): string | undefined {
    return this._objetivoTerapeutico;
  }

  get frequenciaRespiratoria(): FrequenciaRespiratoria | undefined {
    return this._frequenciaRespiratoria;
  }

  get pressaoArterial(): PressaoArterial | undefined {
    return this._pressaoArterial;
  }

  get oxigenacao(): Oxigenacao | undefined {
    return this._oxigenacao;
  }

  get autorizaUsoImagem(): boolean | undefined {
    return this._autorizaUsoImagem;
  }

  get outros(): string | undefined {
    return this._outros;
  }
}
