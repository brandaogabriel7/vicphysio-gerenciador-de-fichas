import Cliente from '../../../../domain/ficha/entity/cliente';
import { SexoEnum } from '../../../../domain/ficha/entity/enum/sexo';
import DataNascimento from '../../../../domain/ficha/value-object/data-nascimento';

import { v4 as uuidv4 } from 'uuid';
import { createSequelizeTestInstance } from '../../../@shared/repository/sequelize/__mocks__/sequelize.mock';
import { Sequelize } from 'sequelize-typescript';
import ClienteRepository from './cliente.repository';
import ClienteModel from './cliente.model';

describe('ClienteRepository - better-sqlite3', () => {
  let sequelize: Sequelize;
  let clienteRepository: ClienteRepository;

  beforeEach(async () => {
    sequelize = createSequelizeTestInstance();

    sequelize.addModels([ClienteModel]);

    await sequelize.sync();

    clienteRepository = new ClienteRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it.each([
    {
      dadosCliente: {
        id: uuidv4(),
        nome: 'Cliente 1',
        numeroRg: '12345678',
        sexo: SexoEnum.MASCULINO,
        dataNascimento: '2001-03-08',
        nomeCuidador: 'Cuidador 1',
      },
    },
    {
      dadosCliente: {
        id: uuidv4(),
        nome: 'Cliente 2',
        numeroRg: '87654321',
        sexo: SexoEnum.FEMININO,
        dataNascimento: '2002-04-09',
        nomeCuidador: 'Cuidador 2',
      },
    },
    {
      dadosCliente: {
        id: uuidv4(),
        nome: 'Cliente 3',
        numeroRg: '12348765',
        dataNascimento: '2003-05-10',
        sexo: SexoEnum.MASCULINO,
        nomeCuidador: 'Cuidador 3',
      },
    },
  ])('deve criar novo cliente', async ({ dadosCliente }) => {
    const cliente = new Cliente(
      dadosCliente.id,
      dadosCliente.nome,
      dadosCliente.numeroRg,
      dadosCliente.sexo,
      dadosCliente.dataNascimento
        ? new DataNascimento(dadosCliente.dataNascimento)
        : undefined,
      dadosCliente.nomeCuidador
    );

    await clienteRepository.create(cliente);

    const clienteCriado = await ClienteModel.findOne({
      where: { id: cliente.id },
    });

    expect(clienteCriado?.id).toBe(cliente.id);
    expect(clienteCriado?.nome).toBe(cliente.nome);
    expect(clienteCriado?.numeroRg).toBe(cliente.numeroRg);
    expect(clienteCriado?.sexo).toBe(cliente.sexo);
    expect(clienteCriado?.dataNascimento).toStrictEqual(
      cliente.dataNascimento?.valor
    );
    expect(clienteCriado?.nomeCuidador).toBe(cliente.nomeCuidador);
  });

  it('deve lançar erro ao tentar criar cliente com id existente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await clienteRepository.create(cliente);

    await expect(clienteRepository.create(cliente)).rejects.toThrow(
      'Cliente já cadastrado'
    );
  });

  it.each([
    {
      dadosCliente: {
        id: uuidv4(),
        nome: 'Cliente 1',
        numeroRg: '12345678',
        sexo: SexoEnum.MASCULINO,
        dataNascimento: '2001-03-08',
        nomeCuidador: 'Cuidador 1',
      },
      dadosClienteAtualizado: {
        nome: 'Cliente 1 Atualizado',
        sexo: SexoEnum.FEMININO,
        numeroRg: '87654321',
        dataNascimento: '2002-03-08',
        nomeCuidador: 'Cuidador Atualizado',
      },
    },
  ])(
    'deve atualizar cliente',
    async ({ dadosCliente, dadosClienteAtualizado }) => {
      const cliente = new Cliente(
        dadosCliente.id,
        dadosCliente.nome,
        dadosCliente.numeroRg,
        dadosCliente.sexo,
        new DataNascimento(dadosCliente.dataNascimento),
        dadosCliente.nomeCuidador
      );

      await clienteRepository.create(cliente);

      cliente.alterarNome(dadosClienteAtualizado.nome);
      cliente.alterarSexo(dadosClienteAtualizado.sexo);
      cliente.alterarDataNascimento(
        new DataNascimento(dadosClienteAtualizado.dataNascimento)
      );
      cliente.alterarNomeCuidador('Cuidador Atualizado');
      cliente.alterarRg('87654321');

      await clienteRepository.update(cliente);

      const clienteAtualizado = await ClienteModel.findOne({
        where: { id: cliente.id },
      });

      expect(clienteAtualizado?.id).toBe(cliente.id);
      expect(clienteAtualizado?.nome).toBe(cliente.nome);
      expect(clienteAtualizado?.numeroRg).toBe(cliente.numeroRg);
      expect(clienteAtualizado?.sexo).toBe(cliente.sexo);
      expect(clienteAtualizado?.dataNascimento).toStrictEqual(
        cliente.dataNascimento?.valor
      );
      expect(clienteAtualizado?.nomeCuidador).toBe(cliente.nomeCuidador);
    }
  );

  it('deve lançar erro ao tentar atualizar cliente inexistente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await expect(clienteRepository.update(cliente)).rejects.toThrow(
      'Cliente não encontrado'
    );
  });

  it('deve deletar cliente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
    });

    await clienteRepository.delete(cliente.id);

    const clienteDeletado = await ClienteModel.findOne({
      where: { id: cliente.id },
    });

    expect(clienteDeletado).toBeNull();
  });

  it('não deve lançar erro ao tentar deletar cliente inexistente', async () => {
    const clienteId = uuidv4();

    await expect(clienteRepository.delete(clienteId)).resolves.not.toThrow();

    const clienteDeletado = await ClienteModel.findOne({
      where: { id: clienteId },
    });

    expect(clienteDeletado).toBeNull();
  });

  it('deve buscar cliente', async () => {
    const cliente = new Cliente(
      uuidv4(),
      'Cliente 1',
      '12345678',
      SexoEnum.MASCULINO,
      new DataNascimento('2001-03-08'),
      'Cuidador 1'
    );

    await ClienteModel.create({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
      sexo: cliente.sexo,
      dataNascimento: cliente.dataNascimento?.valor,
      nomeCuidador: cliente.nomeCuidador,
    });

    const clienteBuscado = await clienteRepository.find(cliente.id);

    expect(clienteBuscado?.id).toBe(cliente.id);
    expect(clienteBuscado?.nome).toBe(cliente.nome);
    expect(clienteBuscado?.numeroRg).toBe(cliente.numeroRg);
    expect(clienteBuscado?.sexo).toBe(cliente.sexo);
    expect(clienteBuscado?.dataNascimento).toStrictEqual(
      cliente.dataNascimento
    );
    expect(clienteBuscado?.nomeCuidador).toBe(cliente.nomeCuidador);
  });

  it('deve lançar erro ao buscar cliente inexistente', async () => {
    const cliente = new Cliente(uuidv4(), 'Cliente 1', '12345678');

    await expect(clienteRepository.find(cliente.id)).rejects.toThrow(
      'Cliente não encontrado'
    );
  });

  it('deve buscar todos os clientes', async () => {
    const cliente1 = new Cliente(
      uuidv4(),
      'Cliente 1',
      '12345678',
      SexoEnum.MASCULINO,
      new DataNascimento('2001-03-08'),
      'Cuidador 1'
    );

    const cliente2 = new Cliente(
      uuidv4(),
      'Cliente 2',
      '87654321',
      SexoEnum.FEMININO,
      new DataNascimento('2002-04-09'),
      'Cuidador 2'
    );

    const cliente3 = new Cliente(
      uuidv4(),
      'Cliente 3',
      '12348765',
      SexoEnum.MASCULINO,
      new DataNascimento('2003-05-10'),
      'Cuidador 3'
    );

    await ClienteModel.create({
      id: cliente1.id,
      nome: cliente1.nome,
      numeroRg: cliente1.numeroRg,
      sexo: cliente1.sexo,
      dataNascimento: cliente1.dataNascimento?.valor,
      nomeCuidador: cliente1.nomeCuidador,
    });

    await ClienteModel.create({
      id: cliente2.id,
      nome: cliente2.nome,
      numeroRg: cliente2.numeroRg,
      sexo: cliente2.sexo,
      dataNascimento: cliente2.dataNascimento?.valor,
      nomeCuidador: cliente2.nomeCuidador,
    });

    await ClienteModel.create({
      id: cliente3.id,
      nome: cliente3.nome,
      numeroRg: cliente3.numeroRg,
      sexo: cliente3.sexo,
      dataNascimento: cliente3.dataNascimento?.valor,
      nomeCuidador: cliente3.nomeCuidador,
    });

    const clientes = await clienteRepository.findAll();

    expect(clientes).toHaveLength(3);
    expect(clientes[0]).toStrictEqual(cliente1);
    expect(clientes[1]).toStrictEqual(cliente2);
    expect(clientes[2]).toStrictEqual(cliente3);
  });
});
