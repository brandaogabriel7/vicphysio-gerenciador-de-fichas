import RepositoryInterface from '../../../../domain/@shared/repository/repository.interface';
import Cliente from '../../../../domain/ficha/entity/cliente';
import { Sexo } from '../../../../domain/ficha/entity/enum/sexo';
import DataNascimento from '../../../../domain/ficha/value-object/data-nascimento';
import ClienteModel from './cliente.model';

export default class ClienteRepository implements RepositoryInterface<Cliente> {
  async create(entity: Cliente): Promise<Cliente> {
    const dadosCliente = {
      id: entity.id,
      nome: entity.nome,
      numeroRg: entity.numeroRg,
      sexo: entity.sexo,
      dataNascimento: entity?.dataNascimento?.valor,
      nomeCuidador: entity?.nomeCuidador,
    };

    const clienteCriado = await ClienteModel.create(dadosCliente);

    return new Cliente(
      clienteCriado.id,
      clienteCriado.nome,
      clienteCriado.numeroRg,
      clienteCriado.sexo as Sexo,
      clienteCriado.dataNascimento
        ? new DataNascimento(clienteCriado.dataNascimento)
        : undefined,
      clienteCriado.nomeCuidador
    );
  }
  update(entity: Cliente): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }
  find(id: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Cliente[]> {
    throw new Error('Method not implemented.');
  }
}
