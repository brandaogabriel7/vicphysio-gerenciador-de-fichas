import RepositoryInterface from '../../../../domain/@shared/repository/repository.interface';
import Cliente from '../../../../domain/ficha/entity/cliente';
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
