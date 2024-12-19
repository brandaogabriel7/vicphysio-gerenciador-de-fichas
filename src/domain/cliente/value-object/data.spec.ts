import Data from './data';

describe('Data tests', () => {
  it('deve criar uma data quando passada uma string de data válida', () => {
    const data = new Data('1993-01-02');
    expect(data.formatar()).toBe('1993-01-02');

    const data2 = new Data('1993-01-02T00:00:00.000Z');
    expect(data2.formatar()).toBe('1993-01-02');
  });

  it('deve criar uma data quando passada um objeto de data válido', () => {
    const data = new Data('1993-01-02');
    expect(data.formatar()).toBe('1993-01-02');

    const data2 = new Data(new Date('1993-01-02T00:20:30.000Z'));
    expect(data2.formatar()).toBe('1993-01-02');
  });

  it('deve lançar um erro quando a string passada não for uma data válida', () => {
    expect(() => {
      new Data('teste');
    }).toThrow('Data inválida');

    expect(() => {
      new Data('23423445');
    }).toThrow('Data inválida');

    const mensagemCustomizada = 'Mensagem customizada de data inválida';
    expect(() => {
      new Data('Outra data inválida', mensagemCustomizada);
    }).toThrow(mensagemCustomizada);
  });

  it('deve retornar objeto de data interno', () => {
    const dataString = '1993-01-02';
    const data = new Data(dataString);

    expect(data.valor).toBeInstanceOf(Date);
    expect(data.valor).toStrictEqual(new Date(dataString));
  });
});
