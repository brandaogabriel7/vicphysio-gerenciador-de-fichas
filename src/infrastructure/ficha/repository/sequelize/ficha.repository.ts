import RepositoryInterface from '../../../../domain/@shared/repository/repository.interface';
import Cliente from '../../../../domain/ficha/entity/cliente';
import { HistoriaPatologicaPregressa } from '../../../../domain/ficha/entity/enum/historia-patologica-pregressa';
import { QualidadeAlimentacao } from '../../../../domain/ficha/entity/enum/qualidade-alimentacao';
import { TipoFicha } from '../../../../domain/ficha/entity/enum/tipo-ficha';
import Ficha from '../../../../domain/ficha/entity/ficha';
import Data from '../../../../domain/ficha/value-object/data';
import ClienteModel from './cliente.model';
import FichaModel from './ficha.model';

export default class FichaRepository implements RepositoryInterface<Ficha> {
  constructor(private clienteRepository: RepositoryInterface<Cliente>) {}

  async create(entity: Ficha): Promise<void> {
    const fichaExistente = await FichaModel.findOne({
      where: { id: entity.id },
    });

    if (fichaExistente) {
      throw new Error('Ficha já cadastrada');
    }

    const clienteExistente = await ClienteModel.findOne({
      where: { id: entity.cliente.id },
    });

    if (!clienteExistente) {
      await this.clienteRepository.create(entity.cliente);
    }

    const dadosFicha = {
      id: entity.id,
      clienteId: entity.cliente.id,
      data: entity.data?.valor,
      historiaMolestiaAtual: entity.historiaMolestiaAtual,
      historiasPatologicasPregressas: entity.historiasPatologicasPregressas,
      qualidadeAlimentacao: entity.qualidadeAlimentacao,
      medicacoes: entity.medicacoes,
      observacoes: entity.observacoes,
      tipoFicha: entity.tipoFicha,
    };

    await FichaModel.create(dadosFicha);
  }
  async update(entity: Ficha): Promise<void> {
    const fichaExistente = await FichaModel.findOne({
      where: { id: entity.id },
    });

    if (!fichaExistente) {
      throw new Error('Ficha não encontrada');
    }

    await FichaModel.update(
      {
        clienteId: entity.cliente.id,
        data: entity.data?.valor,
        historiaMolestiaAtual: entity.historiaMolestiaAtual,
        historiasPatologicasPregressas: entity.historiasPatologicasPregressas,
        qualidadeAlimentacao: entity.qualidadeAlimentacao,
        medicacoes: entity.medicacoes,
        observacoes: entity.observacoes,
        tipoFicha: entity.tipoFicha,
      },
      { where: { id: entity.id } }
    );
  }
  async delete(id: string): Promise<void> {
    await FichaModel.destroy({ where: { id } });
  }
  async find(id: string): Promise<Ficha> {
    const fichaExistente = await FichaModel.findOne({
      where: { id },
    });

    if (!fichaExistente) {
      throw new Error('Ficha não encontrada');
    }

    const cliente = await this.clienteRepository.find(fichaExistente.clienteId);

    const ficha = new Ficha(
      fichaExistente.id,
      cliente,
      fichaExistente.tipoFicha as TipoFicha
    );

    if (fichaExistente.data) {
      ficha.alterarDataFicha(new Data(fichaExistente.data));
    }
    ficha.alterarHistoriaMolestiaAtual(fichaExistente.historiaMolestiaAtual);

    for (const historiaPatologicaPregressa of fichaExistente.historiasPatologicasPregressas) {
      ficha.adicionarHistoriaPatologicaPregressa(
        historiaPatologicaPregressa as HistoriaPatologicaPregressa
      );
    }

    ficha.alterarQualidadeAlimentacao(
      fichaExistente.qualidadeAlimentacao as QualidadeAlimentacao
    );
    ficha.alterarMedicacoes(fichaExistente.medicacoes);
    ficha.alterarObservacoes(fichaExistente.observacoes);

    return ficha;
  }
  async findAll(): Promise<Ficha[]> {
    const fichas = await FichaModel.findAll();

    return Promise.all(
      fichas.map(async (ficha) => {
        const cliente = await this.clienteRepository.find(ficha.clienteId);

        const fichaEntity = new Ficha(
          ficha.id,
          cliente,
          ficha.tipoFicha as TipoFicha
        );

        if (ficha.data) {
          fichaEntity.alterarDataFicha(new Data(ficha.data));
        }
        fichaEntity.alterarHistoriaMolestiaAtual(ficha.historiaMolestiaAtual);

        for (const historiaPatologicaPregressa of ficha.historiasPatologicasPregressas) {
          fichaEntity.adicionarHistoriaPatologicaPregressa(
            historiaPatologicaPregressa as HistoriaPatologicaPregressa
          );
        }

        fichaEntity.alterarQualidadeAlimentacao(
          ficha.qualidadeAlimentacao as QualidadeAlimentacao
        );
        fichaEntity.alterarMedicacoes(ficha.medicacoes);
        fichaEntity.alterarObservacoes(ficha.observacoes);

        return fichaEntity;
      })
    );
  }
}
