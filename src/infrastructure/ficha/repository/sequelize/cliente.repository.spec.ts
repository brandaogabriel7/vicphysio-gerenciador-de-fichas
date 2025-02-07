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
});
