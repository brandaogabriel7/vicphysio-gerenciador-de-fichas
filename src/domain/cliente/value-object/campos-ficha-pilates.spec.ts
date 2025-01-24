import CamposFichaPilates from './campos-ficha-pilates';

describe('Campos ficha pilates tests', () => {
  it.each([
    {
      peso: 70,
      altura: 1.75,
    },
    {
      peso: 90,
      altura: 1.8,
    },
    {
      peso: 100,
      altura: 1.85,
    },
  ])(
    'deve preencher campos específicos da ficha de pilates altura: $altura, peso: $peso',
    (campos) => {
      const camposFichaPilates = new CamposFichaPilates(campos);

      expect(camposFichaPilates.altura.valor).toBe(campos.altura);
      expect(camposFichaPilates.peso.valor).toBe(campos.peso);
    }
  );
});
