import Peso from './peso';

describe('Peso tests', () => {
  it.each([
    {
      valorPeso: 12,
      pesoFormatado: '12kg',
    },
    {
      valorPeso: 70,
      pesoFormatado: '70kg',
    },
    {
      valorPeso: 100,
      pesoFormatado: '100kg',
    },
  ])(
    'deve criar um peso quando passado o valor: $valorPeso',
    ({ valorPeso, pesoFormatado }) => {
      const peso = new Peso(valorPeso);

      expect(peso.valor).toBe(valorPeso);
      expect(peso.formatar()).toBe(pesoFormatado);
    }
  );

  it.each([
    {
      valorPeso: -1,
    },
    {
      valorPeso: -100,
    },
    {
      valorPeso: 0,
    },
  ])(
    'deve lançar um erro quando o valor passado for menor ou igual a 0: $valorPeso',
    ({ valorPeso }) => {
      expect(() => {
        new Peso(valorPeso);
      }).toThrow(/peso inv[áa]lido/i);
    }
  );
});
