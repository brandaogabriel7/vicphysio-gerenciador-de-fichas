import RepositoryInterface from '../../../../domain/@shared/repository/repository.interface';
import Cliente from '../../../../domain/ficha/entity/cliente';
import ClienteModel from './cliente.model';

export default class ClienteRepository implements RepositoryInterface<Cliente> {
  async create(entity: Cliente): Promise<void> {
    const cliente = {
      id: entity.id,
      nome: entity.nome,
      numeroRg: entity.numeroRg,
      sexo: entity.sexo,
      dataNascimento: entity.dataNascimento,
      nomeCuidador: entity.nomeCuidador,
    };

    await ClienteModel.create(cliente);
  }
  update(entity: Cliente): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  find(id: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Cliente[]> {
    throw new Error('Method not implemented.');
  }
}
