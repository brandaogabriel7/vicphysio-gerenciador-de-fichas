import Customer from './customer';

describe('Customer unit tests', () => {
  it('should throw an error when id is empty', () => {
    expect(() => new Customer('', '')).toThrowError(/Id is required/i);
  });

  it('should get the id', () => {
    const customer = new Customer('some id', 'some name');
    expect(customer.id).toBe('some id');
  });

  it('should throw an error when name is empty', () => {
    expect(() => new Customer('some id', '')).toThrowError(/Name is required/i);
  });

  it('should change the name', () => {
    const customer = new Customer('some id', 'some name');

    customer.changeName('new name');

    expect(customer.name).toBe('new name');
  });

  it('should throw an error when trying to change to an empty name', () => {
    const customer = new Customer('some id', 'some name');

    expect(() => customer.changeName('')).toThrowError(/Name is required/i);
  });
});
