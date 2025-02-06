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

    const clienteCriado = await clienteRepository.create(cliente);

    expect(clienteCriado).toStrictEqual(cliente);
  });
});
