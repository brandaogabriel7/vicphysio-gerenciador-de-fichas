import { TipoFicha } from '../../domain/ficha/entity/enum/tipo-ficha';
import { HistoriaPatologicaPregressa } from '../../domain/ficha/entity/enum/historia-patologica-pregressa';
import { QualidadeAlimentacao } from '../../domain/ficha/entity/enum/qualidade-alimentacao';
import { ClienteDTO } from './cliente.dto';

export interface CamposPilatesDTO {
  peso?: number;
  altura?: number;
}

export interface CamposFisioterapiaDTO {
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
}

export interface FichaDTO {
  id: string;
  cliente: ClienteDTO;
  tipoFicha: TipoFicha;
  data?: string;
  historiaMolestiaAtual?: string;
  historiasPatologicasPregressas: HistoriaPatologicaPregressa[];
  qualidadeAlimentacao?: QualidadeAlimentacao;
  medicacoes?: string;
  observacoes?: string;
  camposEspecificos: CamposPilatesDTO | CamposFisioterapiaDTO | object;
}

export interface CreateFichaDTO {
  clienteId: string;
  tipoFicha: TipoFicha;
  data?: string;
  historiaMolestiaAtual?: string;
  historiasPatologicasPregressas?: HistoriaPatologicaPregressa[];
  qualidadeAlimentacao?: QualidadeAlimentacao;
  medicacoes?: string;
  observacoes?: string;
  camposEspecificos?: CamposPilatesDTO | CamposFisioterapiaDTO | object;
}

export interface UpdateFichaDTO extends CreateFichaDTO {
  id: string;
}
