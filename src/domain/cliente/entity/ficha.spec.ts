import Cliente from './cliente';
import Ficha from './ficha';
import { v4 as uuid } from 'uuid';
import { SexoEnum } from './sexo';
import DataGenerica from '../value-object/data-generica';

describe('Ficha tests', () => {
  it('deve falhar quando id está vazio', () => {
    const cliente = new Cliente(
      uuid(),
      'Brands',
      '12345678',
      SexoEnum.MASCULINO
    );
    expect(() => new Ficha('', cliente)).toThrowError(/id é obrigatório/i);
  });

  it('deve criar uma ficha com sucesso', () => {
    const cliente = new Cliente(
      uuid(),
      'Brands',
      '12345678',
      SexoEnum.MASCULINO
    );
    const id = uuid();
    const ficha = new Ficha(id, cliente);

    expect(ficha).toBeInstanceOf(Ficha);
    expect(ficha.id).toBe(id);
    expect(ficha.cliente).toBe(cliente);
    expect(ficha.data).toBeUndefined();

    const dataFicha = new DataGenerica(new Date());
    const ficha2 = new Ficha(id, cliente, dataFicha);

    expect(ficha2).toBeInstanceOf(Ficha);
    expect(ficha2.id).toBe(id);
    expect(ficha2.cliente).toBe(cliente);
    expect(ficha2.data).toBe(dataFicha);
  });

  it('deve alterar a data da ficha', () => {
    const cliente = new Cliente(
      uuid(),
      'Brands',
      '12345678',
      SexoEnum.MASCULINO
    );
    const id = uuid();
    const ficha = new Ficha(id, cliente);

    const dataFicha = new DataGenerica(new Date());
    ficha.alterarDataFicha(dataFicha);

    expect(ficha.data).toBe(dataFicha);
  });
});
