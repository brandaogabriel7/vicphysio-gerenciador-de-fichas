import { ipcMain } from 'electron';
import { v4 as uuid } from 'uuid';
import FichaRepository from '../../src/infrastructure/ficha/repository/sequelize/ficha.repository';
import ClienteRepository from '../../src/infrastructure/ficha/repository/sequelize/cliente.repository';
import Ficha from '../../src/domain/ficha/entity/ficha';
import Data from '../../src/domain/ficha/value-object/data';
import CamposFichaPilates from '../../src/domain/ficha/value-object/campos-ficha-pilates';
import CamposFichaFisioterapia from '../../src/domain/ficha/value-object/campos-ficha-fisioterapia';
import { TipoFicha, TipoFichaEnum } from '../../src/domain/ficha/entity/enum/tipo-ficha';
import { HistoriaPatologicaPregressa } from '../../src/domain/ficha/entity/enum/historia-patologica-pregressa';
import { QualidadeAlimentacao } from '../../src/domain/ficha/entity/enum/qualidade-alimentacao';
import {
  FichaDTO,
  CreateFichaDTO,
  UpdateFichaDTO,
  CamposPilatesDTO,
  CamposFisioterapiaDTO,
} from '../../src/application/dto/ficha.dto';
import { ClienteDTO } from '../../src/application/dto/cliente.dto';
import Cliente from '../../src/domain/ficha/entity/cliente';

const clienteRepository = new ClienteRepository();
const fichaRepository = new FichaRepository(clienteRepository);

function clienteToDTO(cliente: Cliente): ClienteDTO {
  return {
    id: cliente.id,
    nome: cliente.nome,
    numeroRg: cliente.numeroRg,
    sexo: cliente.sexo,
    dataNascimento: cliente.dataNascimento?.formatar(),
    nomeCuidador: cliente.nomeCuidador,
  };
}

function camposEspecificosToDTO(
  ficha: Ficha
): CamposPilatesDTO | CamposFisioterapiaDTO | object {
  const campos = ficha.camposEspecificos;

  if (ficha.tipoFicha === TipoFichaEnum.PILATES && campos instanceof CamposFichaPilates) {
    return {
      peso: campos.peso?.valor,
      altura: campos.altura?.valor,
    };
  }

  if (ficha.tipoFicha === TipoFichaEnum.FISIOTERAPIA && campos instanceof CamposFichaFisioterapia) {
    return {
      testesReflexos: campos.testesReflexos,
      palpacao: campos.palpacao,
      nivelDor: campos.nivelDor?.valor,
      inspecaoGeral: campos.inspecaoGeral,
      movimentosAtivosPassivos: campos.movimentosAtivosPassivos,
      classificacaoInternacionalDeFuncionalidade: campos.classificacaoInternacionalDeFuncionalidade,
      objetivoTerapeutico: campos.objetivoTerapeutico,
      frequenciaRespiratoria: campos.frequenciaRespiratoria?.valor,
      pressaoArterial: campos.pressaoArterial
        ? {
            valorSistolica: campos.pressaoArterial.valorSistolica,
            valorDiastolica: campos.pressaoArterial.valorDiastolica,
          }
        : undefined,
      oxigenacao: campos.oxigenacao?.valor,
      autorizaUsoImagem: campos.autorizaUsoImagem,
      outros: campos.outros,
    };
  }

  return {};
}

function toDTO(ficha: Ficha): FichaDTO {
  return {
    id: ficha.id,
    cliente: clienteToDTO(ficha.cliente),
    tipoFicha: ficha.tipoFicha,
    data: ficha.data?.formatar(),
    historiaMolestiaAtual: ficha.historiaMolestiaAtual,
    historiasPatologicasPregressas: ficha.historiasPatologicasPregressas,
    qualidadeAlimentacao: ficha.qualidadeAlimentacao,
    medicacoes: ficha.medicacoes,
    observacoes: ficha.observacoes,
    camposEspecificos: camposEspecificosToDTO(ficha),
  };
}

async function buildFichaFromDTO(
  data: CreateFichaDTO | UpdateFichaDTO,
  id: string
): Promise<Ficha> {
  const cliente = await clienteRepository.find(data.clienteId);

  const ficha = new Ficha(id, cliente, data.tipoFicha as TipoFicha);

  if (data.data) {
    ficha.alterarDataFicha(new Data(data.data));
  }

  if (data.historiaMolestiaAtual) {
    ficha.alterarHistoriaMolestiaAtual(data.historiaMolestiaAtual);
  }

  if (data.historiasPatologicasPregressas) {
    for (const hpp of data.historiasPatologicasPregressas) {
      ficha.adicionarHistoriaPatologicaPregressa(hpp as HistoriaPatologicaPregressa);
    }
  }

  if (data.qualidadeAlimentacao) {
    ficha.alterarQualidadeAlimentacao(data.qualidadeAlimentacao as QualidadeAlimentacao);
  }

  if (data.medicacoes) {
    ficha.alterarMedicacoes(data.medicacoes);
  }

  if (data.observacoes) {
    ficha.alterarObservacoes(data.observacoes);
  }

  if (data.camposEspecificos && data.tipoFicha !== TipoFichaEnum.NAO_ESPECIFICADO) {
    if (data.tipoFicha === TipoFichaEnum.PILATES) {
      const campos = data.camposEspecificos as CamposPilatesDTO;
      ficha.preencherCamposEspecificos(
        new CamposFichaPilates({
          peso: campos.peso,
          altura: campos.altura,
        })
      );
    } else if (data.tipoFicha === TipoFichaEnum.FISIOTERAPIA) {
      const campos = data.camposEspecificos as CamposFisioterapiaDTO;
      ficha.preencherCamposEspecificos(
        new CamposFichaFisioterapia({
          testesReflexos: campos.testesReflexos,
          palpacao: campos.palpacao,
          nivelDor: campos.nivelDor,
          inspecaoGeral: campos.inspecaoGeral,
          movimentosAtivosPassivos: campos.movimentosAtivosPassivos,
          classificacaoInternacionalDeFuncionalidade: campos.classificacaoInternacionalDeFuncionalidade,
          objetivoTerapeutico: campos.objetivoTerapeutico,
          frequenciaRespiratoria: campos.frequenciaRespiratoria,
          pressaoArterial: campos.pressaoArterial,
          oxigenacao: campos.oxigenacao,
          autorizaUsoImagem: campos.autorizaUsoImagem,
          outros: campos.outros,
        })
      );
    }
  }

  return ficha;
}

export function registerFichaIpcHandlers(): void {
  ipcMain.handle('ficha:findAll', async (): Promise<FichaDTO[]> => {
    const fichas = await fichaRepository.findAll();
    return fichas.map(toDTO);
  });

  ipcMain.handle('ficha:findByCliente', async (_, clienteId: string): Promise<FichaDTO[]> => {
    const allFichas = await fichaRepository.findAll();
    const clienteFichas = allFichas.filter((f) => f.cliente.id === clienteId);
    return clienteFichas.map(toDTO);
  });

  ipcMain.handle('ficha:find', async (_, id: string): Promise<FichaDTO> => {
    const ficha = await fichaRepository.find(id);
    return toDTO(ficha);
  });

  ipcMain.handle('ficha:create', async (_, data: CreateFichaDTO): Promise<void> => {
    const ficha = await buildFichaFromDTO(data, uuid());
    await fichaRepository.create(ficha);
  });

  ipcMain.handle('ficha:update', async (_, data: UpdateFichaDTO): Promise<void> => {
    const ficha = await buildFichaFromDTO(data, data.id);
    await fichaRepository.update(ficha);
  });

  ipcMain.handle('ficha:delete', async (_, id: string): Promise<void> => {
    await fichaRepository.delete(id);
  });
}
