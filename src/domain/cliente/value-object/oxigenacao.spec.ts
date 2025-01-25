import Oxigenacao from './oxigenacao';

describe('Oxigenação tests', () => {
  it.each([
    {
      valorOxigenacao: 95,
      valorFormatado: '95%',
    },
  ])(
    'deve criar uma oxigenação quando passado o valor válido: $valorOxigenacao',
    ({ valorOxigenacao, valorFormatado }) => {
      const oxigenacao = new Oxigenacao(valorOxigenacao);

      expect(oxigenacao.valor).toBe(valorOxigenacao);
      expect(oxigenacao.formatar()).toBe(valorFormatado);
    }
  );
});
