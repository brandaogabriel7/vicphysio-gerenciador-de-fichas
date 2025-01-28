import CamposFichaFisioterapia from './campos-ficha-fisioterapia';

describe('Campos ficha fisioterapia tests', () => {
  it.each([
    {
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
    },
    {
      testesReflexos: 'Testes/reflexos 2',
      palpacao: 'Palpação 2',
      nivelDor: 3,
      inspecaoGeral: 'Inspeção geral 2',
      movimentosAtivosPassivos: 'Movimentos ativos/passivos 2',
      classificacaoInternacionalDeFuncionalidade:
        'Classificação internacional de funcionalidade 2',
      objetivoTerapeutico: 'Objetivo terapêutico 2',
      frequenciaRespiratoria: 24,
      autorizaUsoImagem: false,
      outros: 'Outros 2',
    },
    {
      testesReflexos: 'Testes/reflexos 3',
      palpacao: 'Palpação 3',
      nivelDor: 8,
      inspecaoGeral: 'Inspeção geral 3',
      objetivoTerapeutico: 'Objetivo terapêutico 3',
      frequenciaRespiratoria: 18,
      pressaoArterial: {
        valorSistolica: 140,
        valorDiastolica: 90,
      },
      oxigenacao: 100,
      autorizaUsoImagem: true,
    },
  ])('deve criar campos da ficha de fisioterapia', (valorCampos) => {
    const camposFichaFisioterapia = new CamposFichaFisioterapia(valorCampos);

    expect(camposFichaFisioterapia.testesReflexos).toBe(
      valorCampos.testesReflexos
    );
    expect(camposFichaFisioterapia.palpacao).toBe(valorCampos.palpacao);
    expect(camposFichaFisioterapia.nivelDor?.valor).toBe(valorCampos.nivelDor);
    expect(camposFichaFisioterapia.inspecaoGeral).toBe(
      valorCampos.inspecaoGeral
    );
    expect(camposFichaFisioterapia.movimentosAtivosPassivos).toBe(
      valorCampos.movimentosAtivosPassivos
    );
    expect(
      camposFichaFisioterapia.classificacaoInternacionalDeFuncionalidade
    ).toBe(valorCampos.classificacaoInternacionalDeFuncionalidade);
    expect(camposFichaFisioterapia.objetivoTerapeutico).toBe(
      valorCampos.objetivoTerapeutico
    );
    expect(camposFichaFisioterapia.frequenciaRespiratoria?.valor).toBe(
      valorCampos.frequenciaRespiratoria
    );
    expect(camposFichaFisioterapia.pressaoArterial?.valorSistolica).toBe(
      valorCampos.pressaoArterial?.valorSistolica
    );
    expect(camposFichaFisioterapia.pressaoArterial?.valorDiastolica).toBe(
      valorCampos.pressaoArterial?.valorDiastolica
    );
    expect(camposFichaFisioterapia.oxigenacao?.valor).toBe(
      valorCampos.oxigenacao
    );
    expect(camposFichaFisioterapia.autorizaUsoImagem).toBe(
      valorCampos.autorizaUsoImagem
    );
    expect(camposFichaFisioterapia.outros).toBe(valorCampos.outros);
  });
});
