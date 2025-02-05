import { Sequelize } from 'sequelize-typescript';

const createSequelizeTestInstance = (): Sequelize => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    sync: { force: true },
  });

  return sequelize;
};

export { createSequelizeTestInstance };
