import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'clientes',
  timestamps: false,
  name: { singular: 'cliente', plural: 'clientes' },
})
export default class ClienteModel extends Model {
  @PrimaryKey
  @Column(DataType.UUIDV4)
  declare id: string;

  @Column(DataType.STRING)
  declare nome: string;

  @Column(DataType.STRING)
  declare numeroRg: string;

  @Column(DataType.STRING)
  declare sexo: string;

  @AllowNull
  @Column(DataType.DATE)
  declare dataNascimento: Date;

  @AllowNull
  @Column(DataType.STRING)
  declare nomeCuidador: string;
}
