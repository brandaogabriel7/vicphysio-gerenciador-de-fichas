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

  it('deve criar novo cliente', async () => {
    const cliente = new Cliente(
      uuidv4(),
      'Cliente 1',
      '12345678',
      SexoEnum.MASCULINO,
      new DataNascimento('2001-03-08'),
      'Cuidador 1'
    );

    await clienteRepository.create(cliente);

    const clienteCriado = await clienteRepository.find(cliente.id);

    expect(clienteCriado).toStrictEqual({
      id: cliente.id,
      nome: cliente.nome,
      numeroRg: cliente.numeroRg,
      sexo: cliente.sexo,
      dataNascimento: cliente.dataNascimento,
      nomeCuidador: cliente.nomeCuidador,
    });
  });
});
