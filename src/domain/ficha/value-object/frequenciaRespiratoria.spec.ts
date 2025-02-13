import FrequenciaRespiratoria from './frequencia-respiratoria';

describe('Frequência respiratória tests', () => {
  it.each([
    {
      valorFrequenciaRespiratoria: 18,
      frequenciaRespiratoriaFormatada: '18irpm',
    },
    {
      valorFrequenciaRespiratoria: 20,
      frequenciaRespiratoriaFormatada: '20irpm',
    },
    {
      valorFrequenciaRespiratoria: 25,
      frequenciaRespiratoriaFormatada: '25irpm',
    },
  ])(
    'deve criar uma frequência respiratória quando passado o valor válido: $valorFrequenciaRespiratoria',
    ({ valorFrequenciaRespiratoria, frequenciaRespiratoriaFormatada }) => {
      const frequenciaRespiratoria = new FrequenciaRespiratoria(
        valorFrequenciaRespiratoria
      );

      expect(frequenciaRespiratoria.valor).toBe(valorFrequenciaRespiratoria);
      expect(frequenciaRespiratoria.formatar()).toBe(
        frequenciaRespiratoriaFormatada
      );
    }
  );
});
