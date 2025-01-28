import Cliente from './cliente';
import Ficha from './ficha';
import { v4 as uuid } from 'uuid';
import { SexoEnum } from './enum/sexo';
import DataGenerica from '../value-object/data-generica';
import { HistoriaPatologicaPregressaEnum } from './enum/historia-patologica-pregressa';
import { QualidadeAlimentacaoEnum } from './enum/qualidade-alimentacao';
import { TipoFichaEnum } from './enum/tipo-ficha';
import CamposFichaFisioterapia from '../value-object/campos-ficha-fisioterapia';
import CamposFichaPilates from '../value-object/campos-ficha-pilates';

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

  it.each([...Object.values(TipoFichaEnum).map((t) => [t])])(
    'deve alterar o tipo de ficha para "%s"',
    (tipoFicha) => {
      const cliente = new Cliente(
        uuid(),
        'Brands',
        '12345678',
        SexoEnum.MASCULINO
      );
      const ficha = new Ficha(uuid(), cliente);
      ficha.alterarTipoFicha(tipoFicha);

      expect(ficha.tipoFicha).toBe(tipoFicha);
    }
  );

  describe('campos das fichas', () => {
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
    ])('deve adicionar historia patologica pregressa para "%s"', (hpp) => {
      ficha.adicionarHistoriaPatologicaPregressa(hpp);

      expect(ficha.historiasPatologicasPregressas).toContain(hpp);
    });

    it.each([
      ...Object.values(HistoriaPatologicaPregressaEnum).map((hpp) => [hpp]),
    ])('deve remover historia patologica pregressa para "%s"', (hpp) => {
      ficha.adicionarHistoriaPatologicaPregressa(hpp);
      ficha.removerHistoriaPatologicaPregressa(hpp);

      expect(ficha.historiasPatologicasPregressas).not.toContain(hpp);
    });

    it('deve adicionar mais de uma historia patologica pregressa', () => {
      const hpp1 = HistoriaPatologicaPregressaEnum.ETILISTA;
      const hpp2 = HistoriaPatologicaPregressaEnum.SEDENTARISMO;

      ficha.adicionarHistoriaPatologicaPregressa(hpp1);
      ficha.adicionarHistoriaPatologicaPregressa(hpp2);

      expect(ficha.historiasPatologicasPregressas).toContain(hpp1);
      expect(ficha.historiasPatologicasPregressas).toContain(hpp2);

      ficha.removerHistoriaPatologicaPregressa(hpp1);
      expect(ficha.historiasPatologicasPregressas).not.toContain(hpp1);
      expect(ficha.historiasPatologicasPregressas).toContain(hpp2);
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

    it('deve lançar um erro ao tentar preecher campos específicos de ficha não especificada', () => {
      expect(() => ficha.preencherCamposEspecificos({})).toThrowError(
        /tipo de ficha não especificado/i
      );
    });

    it('deve retornar um objeto vazio se tipo de ficha for não especificado', () => {
      ficha.alterarTipoFicha(TipoFichaEnum.PILATES);

      ficha.preencherCamposEspecificos({ peso: 70, altura: 1.75 });

      ficha.alterarTipoFicha(TipoFichaEnum.NAO_ESPECIFICADO);

      expect(ficha.camposEspecificos).toStrictEqual({});

      ficha.alterarTipoFicha(TipoFichaEnum.FISIOTERAPIA);

      ficha.preencherCamposEspecificos({ testesReflexos: 'Testes/reflexos' });

      ficha.alterarTipoFicha(TipoFichaEnum.NAO_ESPECIFICADO);

      expect(ficha.camposEspecificos).toStrictEqual({});
    });

    it('deve preencher campos da ficha de pilates', () => {
      const camposFichaPilates = new CamposFichaPilates({
        peso: 70,
        altura: 1.75,
      });

      ficha.alterarTipoFicha(TipoFichaEnum.PILATES);

      ficha.preencherCamposEspecificos(camposFichaPilates);

      expect(ficha.camposEspecificos).toStrictEqual(camposFichaPilates);
    });

    it('deve preencher campos da ficha de fisioterapia', () => {
      const camposFichaFisioterapia = new CamposFichaFisioterapia({
        testesReflexos: 'Testes/reflexos',
        palpacao: 'Palpação',
        nivelDor: 6,
        inspecaoGeral: 'Inspeção geral',
        movimentosAtivosPassivos: 'Movimentos ativos/passivos',
        classificacaoInternacionalDeFuncionalidade:
          'Classificação internacional de funcionalidade',
        objetivoTerapeutico: 'Objetivo terapêutico',
        frequenciaRespiratoria: 20,
        pressaoArterial: {
          valorSistolica: 120,
          valorDiastolica: 80,
        },
        oxigenacao: 98,
        autorizaUsoImagem: true,
        outros: 'Outros',
      });

      ficha.alterarTipoFicha(TipoFichaEnum.FISIOTERAPIA);

      ficha.preencherCamposEspecificos(camposFichaFisioterapia);

      expect(ficha.camposEspecificos).toStrictEqual(camposFichaFisioterapia);
    });
  });
});
