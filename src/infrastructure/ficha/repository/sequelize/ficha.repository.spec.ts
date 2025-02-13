import { Sequelize } from 'sequelize-typescript';
import { createSequelizeTestInstance } from '../../../@shared/repository/sequelize/__mocks__/sequelize.mock';
import { v4 as uuidv4 } from 'uuid';
import FichaRepository from './ficha.repository';
import Ficha from '../../../../domain/ficha/entity/ficha';
import FichaModel from './ficha.model';
import { HistoriaPatologicaPregressaEnum } from '../../../../domain/ficha/entity/enum/historia-patologica-pregressa';
import { QualidadeAlimentacaoEnum } from '../../../../domain/ficha/entity/enum/qualidade-alimentacao';
import { TipoFichaEnum } from '../../../../domain/ficha/entity/enum/tipo-ficha';
import Cliente from '../../../../domain/ficha/entity/cliente';
import Data from '../../../../domain/ficha/value-object/data';
import ClienteModel from './cliente.model';
import ClienteRepository from './cliente.repository';
describe('FichaRepository - better-sqlite3', () => {
  let sequelize: Sequelize;
  let fichaRepository: FichaRepository;
  let clienteRepository: ClienteRepository;

  beforeEach(async () => {
    sequelize = createSequelizeTestInstance();

    sequelize.addModels([ClienteModel, FichaModel]);

    await sequelize.sync();

    clienteRepository = new ClienteRepository();

    fichaRepository = new FichaRepository(clienteRepository);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it.each([
    {
      dadosFicha: {
        id: uuidv4(),
        clienteId: uuidv4(),
        data: '2022-01-01',
        historiaMolestiaAtual: 'História da moléstia atual',
        historiasPatologicasPregressas: [
          HistoriaPatologicaPregressaEnum.ETILISTA,
          HistoriaPatologicaPregressaEnum.OBESIDADE,
        ],
        qualidadeAlimentacao: QualidadeAlimentacaoEnum.BOA,
        medicacoes: 'Medicações',
        observacoes: 'Observações',
        tipoFicha: TipoFichaEnum.NAO_ESPECIFICADO,
      },
    },
  ])('deve criar nova ficha', async ({ dadosFicha }) => {
    const cliente = new Cliente(dadosFicha.clienteId, 'Cliente', '12345678');

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
    });

    const ficha = new Ficha(dadosFicha.id, cliente, dadosFicha.tipoFicha);

    ficha.alterarDataFicha(new Data(dadosFicha.data));
    ficha.alterarHistoriaMolestiaAtual(dadosFicha.historiaMolestiaAtual);
    for (const historiaPatologicaPregressa of dadosFicha.historiasPatologicasPregressas) {
      ficha.adicionarHistoriaPatologicaPregressa(historiaPatologicaPregressa);
    }
    ficha.alterarQualidadeAlimentacao(dadosFicha.qualidadeAlimentacao);
    ficha.alterarMedicacoes(dadosFicha.medicacoes);
    ficha.alterarObservacoes(dadosFicha.observacoes);

    await fichaRepository.create(ficha);

    const fichaCriada = await FichaModel.findOne({
      where: { id: ficha.id },
    });

    expect(fichaCriada).not.toBeNull();
    expect(fichaCriada?.id).toBe(ficha.id);
    expect(fichaCriada?.clienteId).toBe(ficha.cliente.id);
    expect(fichaCriada?.data).toStrictEqual(ficha.data?.valor);
    expect(fichaCriada?.historiaMolestiaAtual).toBe(
      dadosFicha.historiaMolestiaAtual
    );
    expect(fichaCriada?.historiasPatologicasPregressas).toStrictEqual(
      dadosFicha.historiasPatologicasPregressas
    );
    expect(fichaCriada?.qualidadeAlimentacao).toBe(
      dadosFicha.qualidadeAlimentacao
    );
    expect(fichaCriada?.medicacoes).toBe(dadosFicha.medicacoes);
    expect(fichaCriada?.observacoes).toBe(dadosFicha.observacoes);
    expect(fichaCriada?.tipoFicha).toBe(dadosFicha.tipoFicha);
  });

  it('deve criar cliente e ficha', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha.alterarDataFicha(new Data('2022-01-01'));
    ficha.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha.alterarMedicacoes('Medicações');
    ficha.alterarObservacoes('Observações');

    await fichaRepository.create(ficha);

    const clienteCriado = await ClienteModel.findOne({
      where: { id: cliente.id },
    });

    expect(clienteCriado).not.toBeNull();
    expect(clienteCriado?.id).toBe(cliente.id);
    expect(clienteCriado?.nome).toBe(cliente.nome);
    expect(clienteCriado?.numeroRg).toBe(cliente.numeroRg);

    const fichaCriada = await FichaModel.findOne({
      where: { id: ficha.id },
    });

    expect(fichaCriada).not.toBeNull();
    expect(fichaCriada?.id).toBe(ficha.id);
    expect(fichaCriada?.clienteId).toBe(ficha.cliente.id);
    expect(fichaCriada?.data).toStrictEqual(ficha.data?.valor);
    expect(fichaCriada?.historiaMolestiaAtual).toBe(
      ficha.historiaMolestiaAtual
    );
    expect(fichaCriada?.historiasPatologicasPregressas).toStrictEqual(
      Array.from(ficha.historiasPatologicasPregressas)
    );
    expect(fichaCriada?.qualidadeAlimentacao).toBe(ficha.qualidadeAlimentacao);
    expect(fichaCriada?.medicacoes).toBe(ficha.medicacoes);
    expect(fichaCriada?.observacoes).toBe(ficha.observacoes);
    expect(fichaCriada?.tipoFicha).toBe(ficha.tipoFicha);
  });

  it('deve lançar erro ao criar ficha com id existente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    await fichaRepository.create(ficha);

    await expect(fichaRepository.create(ficha)).rejects.toThrow(
      'Ficha já cadastrada'
    );
  });

  it('deve atualizar ficha', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha.alterarDataFicha(new Data('2022-01-01'));
    ficha.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha.alterarMedicacoes('Medicações');
    ficha.alterarObservacoes('Observações');

    await fichaRepository.create(ficha);

    ficha.alterarHistoriaMolestiaAtual('História da moléstia atual atualizada');
    ficha.removerHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.RUIM);
    ficha.alterarMedicacoes('Medicações atualizadas');
    ficha.alterarObservacoes('Observações atualizadas');

    await fichaRepository.update(ficha);

    const fichaAtualizada = await FichaModel.findOne({
      where: { id: ficha.id },
    });

    expect(fichaAtualizada).not.toBeNull();
    expect(fichaAtualizada?.id).toBe(ficha.id);
    expect(fichaAtualizada?.clienteId).toBe(ficha.cliente.id);
    expect(fichaAtualizada?.data).toStrictEqual(ficha.data?.valor);
    expect(fichaAtualizada?.historiaMolestiaAtual).toBe(
      ficha.historiaMolestiaAtual
    );
    expect(fichaAtualizada?.historiasPatologicasPregressas).toStrictEqual(
      Array.from(ficha.historiasPatologicasPregressas)
    );
    expect(fichaAtualizada?.qualidadeAlimentacao).toBe(
      ficha.qualidadeAlimentacao
    );
    expect(fichaAtualizada?.medicacoes).toBe(ficha.medicacoes);
    expect(fichaAtualizada?.observacoes).toBe(ficha.observacoes);
  });

  it('deve lançar erro ao tentar atualizar ficha inexistente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    await expect(fichaRepository.update(ficha)).rejects.toThrow(
      'Ficha não encontrada'
    );
  });

  it('deve deletar ficha', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
    });

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha.alterarDataFicha(new Data('2022-01-01'));
    ficha.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha.alterarMedicacoes('Medicações');
    ficha.alterarObservacoes('Observações');

    await FichaModel.create({
      id: ficha.id,
      clienteId: cliente.id,
      data: ficha.data?.valor,
      historiaMolestiaAtual: ficha.historiaMolestiaAtual,
      historiasPatologicasPregressas: Array.from(
        ficha.historiasPatologicasPregressas
      ),
      qualidadeAlimentacao: ficha.qualidadeAlimentacao,
      medicacoes: ficha.medicacoes,
      observacoes: ficha.observacoes,
      tipoFicha: ficha.tipoFicha,
    });

    await fichaRepository.delete(ficha.id);

    const fichaDeletada = await FichaModel.findOne({
      where: { id: ficha.id },
    });

    expect(fichaDeletada).toBeNull();
  });

  it('não deve lançar erro ao tentar deletar ficha inexistente', async () => {
    const fichaId = uuidv4();
    await expect(fichaRepository.delete(fichaId)).resolves.not.toThrow();

    const fichaDeletada = await FichaModel.findOne({
      where: { id: fichaId },
    });

    expect(fichaDeletada).toBeNull();
  });

  it('deve buscar ficha', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
    });

    const ficha = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha.alterarDataFicha(new Data('2022-01-01'));
    ficha.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha.alterarMedicacoes('Medicações');
    ficha.alterarObservacoes('Observações');

    await FichaModel.create({
      id: ficha.id,
      clienteId: cliente.id,
      data: ficha.data?.valor,
      historiaMolestiaAtual: ficha.historiaMolestiaAtual,
      historiasPatologicasPregressas: Array.from(
        ficha.historiasPatologicasPregressas
      ),
      qualidadeAlimentacao: ficha.qualidadeAlimentacao,
      medicacoes: ficha.medicacoes,
      observacoes: ficha.observacoes,
      tipoFicha: ficha.tipoFicha,
    });

    const fichaBuscada = await fichaRepository.find(ficha.id);

    expect(fichaBuscada).not.toBeNull();
    expect(fichaBuscada?.id).toBe(ficha.id);
    expect(fichaBuscada?.cliente.id).toBe(ficha.cliente.id);
    expect(fichaBuscada.cliente.nome).toBe(ficha.cliente.nome);
    expect(fichaBuscada.cliente.numeroRg).toBe(ficha.cliente.numeroRg);
    expect(fichaBuscada?.data?.valor).toStrictEqual(ficha.data?.valor);
    expect(fichaBuscada?.historiaMolestiaAtual).toBe(
      ficha.historiaMolestiaAtual
    );
    expect(fichaBuscada?.historiasPatologicasPregressas).toStrictEqual(
      Array.from(ficha.historiasPatologicasPregressas)
    );
    expect(fichaBuscada?.qualidadeAlimentacao).toBe(ficha.qualidadeAlimentacao);
    expect(fichaBuscada?.medicacoes).toBe(ficha.medicacoes);
    expect(fichaBuscada?.observacoes).toBe(ficha.observacoes);
  });

  it('deve lançar erro ao buscar ficha inexistente', async () => {
    const fichaId = uuidv4();
    await expect(fichaRepository.find(fichaId)).rejects.toThrow(
      'Ficha não encontrada'
    );
  });

  it('deve buscar fichas', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
    });

    const ficha1 = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha1.alterarDataFicha(new Data('2022-01-01'));
    ficha1.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha1.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha1.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha1.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha1.alterarMedicacoes('Medicações');
    ficha1.alterarObservacoes('Observações');

    const ficha2 = new Ficha(uuidv4(), cliente, TipoFichaEnum.NAO_ESPECIFICADO);

    ficha2.alterarDataFicha(new Data('2022-01-02'));
    ficha2.alterarHistoriaMolestiaAtual('História da moléstia atual');
    ficha2.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.ETILISTA
    );
    ficha2.adicionarHistoriaPatologicaPregressa(
      HistoriaPatologicaPregressaEnum.OBESIDADE
    );
    ficha2.alterarQualidadeAlimentacao(QualidadeAlimentacaoEnum.BOA);
    ficha2.alterarMedicacoes('Medicações');
    ficha2.alterarObservacoes('Observações');

    await FichaModel.bulkCreate([
      {
        id: ficha1.id,
        clienteId: cliente.id,
        data: ficha1.data?.valor,
        historiaMolestiaAtual: ficha1.historiaMolestiaAtual,
        historiasPatologicasPregressas: Array.from(
          ficha1.historiasPatologicasPregressas
        ),
        qualidadeAlimentacao: ficha1.qualidadeAlimentacao,
        medicacoes: ficha1.medicacoes,
        observacoes: ficha1.observacoes,
        tipoFicha: ficha1.tipoFicha,
      },
      {
        id: ficha2.id,
        clienteId: cliente.id,
        data: ficha2.data?.valor,
        historiaMolestiaAtual: ficha2.historiaMolestiaAtual,
        historiasPatologicasPregressas: Array.from(
          ficha2.historiasPatologicasPregressas
        ),
        qualidadeAlimentacao: ficha2.qualidadeAlimentacao,
        medicacoes: ficha2.medicacoes,
        observacoes: ficha2.observacoes,
        tipoFicha: ficha2.tipoFicha,
      },
    ]);

    const fichas = await fichaRepository.findAll();

    expect(fichas).toHaveLength(2);
    expect(fichas[0].id).toBe(ficha1.id);
    expect(fichas[0].cliente.id).toBe(ficha1.cliente.id);
    expect(fichas[0].data?.valor).toStrictEqual(ficha1.data?.valor);
    expect(fichas[0].historiaMolestiaAtual).toBe(ficha1.historiaMolestiaAtual);
    expect(fichas[0].historiasPatologicasPregressas).toStrictEqual(
      Array.from(ficha1.historiasPatologicasPregressas)
    );
    expect(fichas[0].qualidadeAlimentacao).toBe(ficha1.qualidadeAlimentacao);
    expect(fichas[0].medicacoes).toBe(ficha1.medicacoes);
    expect(fichas[0].observacoes).toBe(ficha1.observacoes);

    expect(fichas[1].id).toBe(ficha2.id);
    expect(fichas[1].cliente.id).toBe(ficha2.cliente.id);
    expect(fichas[1].data?.valor).toStrictEqual(ficha2.data?.valor);
    expect(fichas[1].historiaMolestiaAtual).toBe(ficha2.historiaMolestiaAtual);
    expect(fichas[1].historiasPatologicasPregressas).toStrictEqual(
      Array.from(ficha2.historiasPatologicasPregressas)
    );
    expect(fichas[1].qualidadeAlimentacao).toBe(ficha2.qualidadeAlimentacao);
    expect(fichas[1].medicacoes).toBe(ficha2.medicacoes);
    expect(fichas[1].observacoes).toBe(ficha2.observacoes);
  });
});
