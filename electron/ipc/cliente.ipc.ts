import { ipcMain } from 'electron';
import { v4 as uuid } from 'uuid';
import ClienteRepository from '../../src/infrastructure/ficha/repository/sequelize/cliente.repository';
import Cliente from '../../src/domain/ficha/entity/cliente';
import DataNascimento from '../../src/domain/ficha/value-object/data-nascimento';
import { Sexo } from '../../src/domain/ficha/entity/enum/sexo';
import { ClienteDTO, CreateClienteDTO, UpdateClienteDTO } from '../../src/application/dto/cliente.dto';

const repository = new ClienteRepository();

function toDTO(cliente: Cliente): ClienteDTO {
  return {
    id: cliente.id,
    nome: cliente.nome,
    numeroRg: cliente.numeroRg,
    sexo: cliente.sexo,
    dataNascimento: cliente.dataNascimento?.formatar(),
    nomeCuidador: cliente.nomeCuidador,
  };
}

export function registerClienteIpcHandlers(): void {
  ipcMain.handle('cliente:findAll', async (): Promise<ClienteDTO[]> => {
    const clientes = await repository.findAll();
    return clientes.map(toDTO);
  });

  ipcMain.handle('cliente:find', async (_, id: string): Promise<ClienteDTO> => {
    const cliente = await repository.find(id);
    return toDTO(cliente);
  });

  ipcMain.handle('cliente:create', async (_, data: CreateClienteDTO): Promise<void> => {
    const cliente = new Cliente(
      uuid(),
      data.nome,
      data.numeroRg,
      data.sexo as Sexo,
      data.dataNascimento ? new DataNascimento(data.dataNascimento) : undefined,
      data.nomeCuidador
    );
    await repository.create(cliente);
  });

  ipcMain.handle('cliente:update', async (_, data: UpdateClienteDTO): Promise<void> => {
    const cliente = new Cliente(
      data.id,
      data.nome,
      data.numeroRg,
      data.sexo as Sexo,
      data.dataNascimento ? new DataNascimento(data.dataNascimento) : undefined,
      data.nomeCuidador
    );
    await repository.update(cliente);
  });

  ipcMain.handle('cliente:delete', async (_, id: string): Promise<void> => {
    await repository.delete(id);
  });
}
