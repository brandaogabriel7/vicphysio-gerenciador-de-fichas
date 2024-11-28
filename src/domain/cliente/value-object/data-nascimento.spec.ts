import DataNascimento from './data-nascimento';

describe('Data de nascimento tests', () => {
  it('deve criar uma data de nascimento quando passada uma string de data válida', () => {
    const dataNascimento = new DataNascimento('1993-01-02');
    expect(dataNascimento.valor).toBe('1993-01-02');

    const dataNascimento2 = new DataNascimento('1993-01-02T00:00:00.000Z');
    expect(dataNascimento2.valor).toBe('1993-01-02');
  });

  it('deve criar uma data de nascimento quando passada um objeto de data válido', () => {
    const dataNascimento = new DataNascimento('1993-01-02');
    expect(dataNascimento.valor).toBe('1993-01-02');

    const dataNascimento2 = new DataNascimento(
      new Date('1993-01-02T00:20:30.000Z')
    );
    expect(dataNascimento2.valor).toBe('1993-01-02');
  });

  it('deve lançar um erro quando a string passada não for uma data válida', () => {
    expect(() => {
      new DataNascimento('teste');
    }).toThrow('Data de nascimento inválida');

    expect(() => {
      new DataNascimento('23423445');
    }).toThrow('Data de nascimento inválida');
  });

  it('deve lançar um erro quando a data de nascimento estiver no futuro', () => {
    expect(() => {
      const dataFutura = new Date();
      dataFutura.setFullYear(dataFutura.getFullYear() + 1);
      new DataNascimento(dataFutura);
    }).toThrow('Data de nascimento não pode estar no futuro');

    expect(() => {
      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + 1);
      new DataNascimento(dataFutura);
    }).toThrow('Data de nascimento não pode estar no futuro');
  });
});
