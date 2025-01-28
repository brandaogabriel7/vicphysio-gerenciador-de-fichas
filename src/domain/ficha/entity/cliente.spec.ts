import Cliente from './cliente';
import { v4 as uuid } from 'uuid';
import { Sexo, SexoEnum } from './enum/sexo';
import DataNascimento from '../value-object/data-nascimento';

describe('Cliente tests', () => {
  describe('id', () => {
    it('deve falhar quando id esta vazio', () => {
      expect(() => new Cliente('', '', '')).toThrowError(/id é obrigatório/i);
    });

    it('deve retornar o id', () => {
      const id = uuid();
      const cliente = new Cliente(id, 'Brands', '12345678');
      expect(cliente.id).toBe(id);
    });
  });

  describe('nome', () => {
    it('deve falhar quando nome esta vazio', () => {
      expect(() => new Cliente(uuid(), '', '')).toThrowError(
        /nome é obrigatório/i
      );
    });

    it('deve falhar quando tentar alterar para nome vazio', () => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO
      );

      expect(() => cliente.alterarNome('')).toThrowError(/nome é obrigatório/i);
    });

    it('deve alterar o nome', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      const novoNome = 'Brandão';
      cliente.alterarNome(novoNome);

      expect(cliente.name).toBe(novoNome);
    });

    it('deve retornar o nome do cliente', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      expect(cliente.name).toBe('Brands');
    });
  });

  describe('rg', () => {
    it('deve falhar quando numero de RG esta vazio', () => {
      expect(() => new Cliente(uuid(), 'Brands', '')).toThrowError(
        /número de rg é obrigatório/i
      );
    });

    it('deve retornar o numero de RG do cliente', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      expect(cliente.rg).toBe('12345678');
    });

    it('deve falhar quando tentar alterar para numero de RG vazio', () => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO
      );

      expect(() => cliente.alterarRg('')).toThrowError(
        /número de rg é obrigatório/i
      );
    });

    it('deve alterar o numero de RG', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      const novoRg = '87654321';
      cliente.alterarRg(novoRg);

      expect(cliente.rg).toBe(novoRg);
    });
  });

  describe('sexo', () => {
    it.each([...Object.values(SexoEnum).map((s) => [s])])(
      'deve retornar o sexo do cliente. sexo: %s',
      (sexo: Sexo) => {
        const cliente = new Cliente(uuid(), 'Brands', '12345678', sexo);

        expect(cliente.sexo).toBe(sexo);
      }
    );

    it('deve alterar o sexo do cliente', () => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO
      );

      cliente.alterarSexo(SexoEnum.FEMININO);

      expect(cliente.sexo).toBe(SexoEnum.FEMININO);
    });
  });
  describe('dataNascimento', () => {
    it('deve alterar data de nascimento do cliente', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      expect(cliente.dataNascimento).toBeUndefined();

      const dataNascimento = new DataNascimento('1990-01-01');

      cliente.alterarDataNascimento(dataNascimento);

      expect(cliente.dataNascimento).toBe(dataNascimento);
    });

    it('deve retornar data de nascimento do cliente', () => {
      const dataNascimento = new DataNascimento('1990-01-01');

      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO,
        dataNascimento
      );

      expect(cliente.dataNascimento).toBe(dataNascimento);
    });
  });

  describe('nomeCuidador', () => {
    it('deve retornar nome do cuidador do cliente', () => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO,
        undefined,
        'Cuidador do Brands'
      );

      expect(cliente.nomeCuidador).toBe('Cuidador do Brands');
    });

    it('deve alterar nome do cuidador do cliente', () => {
      const cliente = new Cliente(uuid(), 'Brands', '12345678');

      expect(cliente.nomeCuidador).toBeUndefined();

      const nomeCuidador = 'Cuidador Brands';

      cliente.alterarNomeCuidador(nomeCuidador);

      expect(cliente.nomeCuidador).toBe(nomeCuidador);
    });
  });
});
