import NumeroTelefone from './numero-telefone';

describe('Número de telefone tests', () => {
  it('deve criar um número de telefone quando passado um número válido', () => {
    const numeroTelefone = new NumeroTelefone('12345678901');
    expect(numeroTelefone.valor).toBe('12345678901');

    const numeroTelefone2 = new NumeroTelefone('1234567890');
    expect(numeroTelefone2.valor).toBe('1234567890');
  });

  it('deve lançar um erro quando o número de telefone passado não for um número válido', () => {
    expect(() => {
      new NumeroTelefone('teste');
    }).toThrow('Número de telefone inválido');

    expect(() => {
      new NumeroTelefone('23423445');
    }).toThrow('Número de telefone inválido');
  });
});
