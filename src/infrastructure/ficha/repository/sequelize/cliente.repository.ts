import RepositoryInterface from '../../../../domain/@shared/repository/repository.interface';
import Cliente from '../../../../domain/ficha/entity/cliente';
import { Sexo } from '../../../../domain/ficha/entity/enum/sexo';
import DataNascimento from '../../../../domain/ficha/value-object/data-nascimento';
import ClienteModel from './cliente.model';

export default class ClienteRepository implements RepositoryInterface<Cliente> {
  async create(entity: Cliente): Promise<void> {
    const clienteExistente = await ClienteModel.findOne({
      where: { id: entity.id },
    });

    if (clienteExistente) {
      throw new Error('Cliente já cadastrado');
    }

    const dadosCliente = {
      id: entity.id,
      nome: entity.nome,
      numeroRg: entity.numeroRg,
      sexo: entity.sexo,
      dataNascimento: entity?.dataNascimento?.valor,
      nomeCuidador: entity?.nomeCuidador,
    };

    await ClienteModel.create(dadosCliente);
  }
  async update(entity: Cliente): Promise<void> {
    const clienteExistente = await ClienteModel.findOne({
      where: { id: entity.id },
    });

    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    await ClienteModel.update(
      {
        nome: entity.nome,
        numeroRg: entity.numeroRg,
        sexo: entity.sexo,
        dataNascimento: entity?.dataNascimento?.valor,
        nomeCuidador: entity?.nomeCuidador,
      },
      { where: { id: entity.id } }
    );
  }
  async delete(id: string): Promise<void> {
    await ClienteModel.destroy({ where: { id } });
  }
  async find(id: string): Promise<Cliente> {
    const cliente = await ClienteModel.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return new Cliente(
      cliente.id,
      cliente.nome,
      cliente.numeroRg,
      cliente.sexo as Sexo,
      cliente.dataNascimento
        ? new DataNascimento(cliente.dataNascimento)
        : undefined,
      cliente.nomeCuidador
    );
  }
  async findAll(): Promise<Cliente[]> {
    const clientes = await ClienteModel.findAll();

    return clientes.map(
      (cliente) =>
        new Cliente(
          cliente.id,
          cliente.nome,
          cliente.numeroRg,
          cliente.sexo as Sexo,
          cliente.dataNascimento
            ? new DataNascimento(cliente.dataNascimento)
            : undefined,
          cliente.nomeCuidador
        )
    );
  }
}
