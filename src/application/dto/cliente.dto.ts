import { Sexo } from '../../domain/ficha/entity/enum/sexo';

export interface ClienteDTO {
  id: string;
  nome: string;
  numeroRg: string;
  sexo: Sexo;
  dataNascimento?: string;
  nomeCuidador?: string;
}

export interface CreateClienteDTO {
  nome: string;
  numeroRg: string;
  sexo: Sexo;
  dataNascimento?: string;
  nomeCuidador?: string;
}

export type UpdateClienteDTO = ClienteDTO;
