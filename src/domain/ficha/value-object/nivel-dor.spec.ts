import NivelDor from './nivel-dor';

describe('Nível dor tests', () => {
  it.each([
    {
      valorDor: 6,
    },
    {
      valorDor: 10,
    },
    {
      valorDor: 0,
    },
  ])(
    'deve criar um nível de dor quando passado o valor: $valorDor',
    ({ valorDor }) => {
      const nivelDor = new NivelDor(valorDor);

      expect(nivelDor.valor).toBe(valorDor);
    }
  );

  it.each([{ valorDor: -1 }, { valorDor: 11 }, { valorDor: -3 }])(
    'deve lançar um erro se o nível de dor não estiver no intervalo de 0 a 10',
    ({ valorDor }) => {
      expect(() => {
        new NivelDor(valorDor);
      }).toThrow(/nível de dor inválido/i);
    }
  );
});
