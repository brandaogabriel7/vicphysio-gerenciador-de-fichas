import Cliente from './cliente';
import Ficha from './ficha';
import { v4 as uuid } from 'uuid';
import { SexoEnum } from './enum/sexo';
import DataGenerica from '../value-object/data-generica';
import { HistoriaPatologicaPregressaEnum } from './enum/historia-patologica-pregressa';
import { QualidadeAlimentacaoEnum } from './enum/qualidade-alimentacao';

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
  });

  describe('campos da ficha', () => {
    let ficha: Ficha;
    beforeEach(() => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO
      );
      ficha = new Ficha(uuid(), cliente);
    });

    it('deve alterar a data da ficha', () => {
      const dataFicha = new DataGenerica(new Date());
      ficha.alterarDataFicha(dataFicha);

      expect(ficha.data).toBe(dataFicha);
    });

    it.each([
      ['Dor nas costas'],
      ['Dor nos joelhos'],
      ['Dor nos pés'],
      ['Dor nos ombros'],
    ])(
      'deve alterar historia da molestia atual para "%s"',
      (historiaMolestiaAtual) => {
        ficha.alterarHistoriaMolestiaAtual(historiaMolestiaAtual);

        expect(ficha.historiaMolestiaAtual).toBe(historiaMolestiaAtual);
      }
    );

    it.each([
      ...Object.values(HistoriaPatologicaPregressaEnum).map((hpp) => [hpp]),
    ])('deve alterar historia patologica pregressa para "%s"', (hma) => {
      ficha.alterarHistoriaPatologiaPregressa(hma);

      expect(ficha.historiaPatologiaPregressa).toBe(hma);
    });

    it.each([...Object.values(QualidadeAlimentacaoEnum).map((qa) => [qa])])(
      'deve alterar qualidade alimentacao para "%s"',
      (qualidadeAlimentação) => {
        ficha.alterarQualidadeAlimentacao(qualidadeAlimentação);

        expect(ficha.qualidadeAlimentacao).toBe(qualidadeAlimentação);
      }
    );

    it.each([['Remédio 1'], ['Remédio 2'], ['Remédio 3'], ['Remédio 4']])(
      'deve alterar campo de medicações para "%s"',
      (medicacoes) => {
        ficha.alterarMedicacoes(medicacoes);

        expect(ficha.medicacoes).toBe(medicacoes);
      }
    );

    it.each([['Observações 1'], ['Observações 2'], ['Observações 3']])(
      'deve alterar campo de observações para "%s"',
      (observacoes) => {
        ficha.alterarObservacoes(observacoes);

        expect(ficha.observacoes).toBe(observacoes);
      }
    );
  });
});
