import PressaoArterial from './pressao-arterial';

describe('Pressão arterial tests', () => {
  it.each([
    {
      valorPressaoArterial: {
        valorSistolica: 120,
        valorDiastolica: 80,
      },
      valorPressaoArterialFormatado: '120/80mmHg',
    },
  ])(
    'deve criar uma pressão arterial quando passado os valores válidos',
    ({ valorPressaoArterial, valorPressaoArterialFormatado }) => {
      // Arrange
      const pressaoArterial = new PressaoArterial(valorPressaoArterial);

      // Assert
      expect(pressaoArterial.valorSistolica).toBe(
        valorPressaoArterial.valorSistolica
      );
      expect(pressaoArterial.valorDiastolica).toBe(
        valorPressaoArterial.valorDiastolica
      );
      expect(pressaoArterial.formatar()).toBe(valorPressaoArterialFormatado);
    }
  );
});
