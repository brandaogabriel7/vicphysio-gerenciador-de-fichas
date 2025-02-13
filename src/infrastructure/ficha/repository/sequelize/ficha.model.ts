import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import ClienteModel from './cliente.model';

@Table({
  tableName: 'fichas',
  timestamps: false,
  name: { singular: 'ficha', plural: 'fichas' },
})
export default class FichaModel extends Model {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  declare id: string;

  @ForeignKey(() => ClienteModel)
  @Column(DataType.UUIDV4)
  declare clienteId: string;

  @AllowNull
  @Column(DataType.DATE)
  declare data: Date;

  @AllowNull
  @Column(DataType.STRING)
  declare historiaMolestiaAtual: string;

  @Column(DataType.JSON)
  declare historiasPatologicasPregressas: string[];

  @AllowNull
  @Column(DataType.STRING)
  declare qualidadeAlimentacao: string;

  @AllowNull
  @Column(DataType.STRING)
  declare medicacoes: string;

  @AllowNull
  @Column(DataType.STRING)
  declare observacoes: string;

  @AllowNull
  @Column(DataType.STRING)
  declare tipoFicha: string;

  @AllowNull
  @Column(DataType.JSON)
  declare camposEspecificosPilates: object;

  @AllowNull
  @Column(DataType.JSON)
  declare camposEspecificosFisioterapia: object;
}
