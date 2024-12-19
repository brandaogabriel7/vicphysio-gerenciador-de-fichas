import DataGenerica from './data-generica';

describe('Data genérica tests', () => {
  it('deve criar uma data genérica quando passada uma string de data válida', () => {
    const data = new DataGenerica('1993-01-02');
    expect(data.formatar()).toBe('1993-01-02');

    const data2 = new DataGenerica('1993-01-02T00:00:00.000Z');
    expect(data2.formatar()).toBe('1993-01-02');
  });
});
