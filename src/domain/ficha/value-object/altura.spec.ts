import Altura from './altura';

describe('Altura tests', () => {
  it.each([{ valorAltura: 1.75, alturaFormatada: '1,75m' }])(
    'deve criar uma altura quando passado o valor válido: $valorAltura',
    ({ valorAltura, alturaFormatada }) => {
      const altura = new Altura(valorAltura);

      expect(altura.valor).toBe(valorAltura);
      expect(altura.formatar()).toBe(alturaFormatada);
    }
  );

  it.each([{ valorAltura: -1 }, { valorAltura: -100 }, { valorAltura: 0 }])(
    'deve lançar um erro quando o valor passado for menor ou igual a 0: $valorAltura',
    ({ valorAltura }) => {
      expect(() => {
        new Altura(valorAltura);
      }).toThrow(/altura inválida/i);
    }
  );
});
