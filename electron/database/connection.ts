import { Sequelize } from 'sequelize-typescript';
import { app } from 'electron';
import path from 'node:path';
import BetterSqlite3Wrapper from './better-sqlite3-wrapper';
// Explicitly import moment so Vite bundles it - Sequelize uses dynamic require
import 'moment';
import ClienteModel from '../../src/infrastructure/ficha/repository/sequelize/cliente.model';
import FichaModel from '../../src/infrastructure/ficha/repository/sequelize/ficha.model';

let sequelize: Sequelize | null = null;

export async function initializeDatabase(): Promise<Sequelize> {
  if (sequelize) {
    return sequelize;
  }

  const isDev = !app.isPackaged;
  const dbPath = isDev
    ? path.join(process.cwd(), 'vicphysio.db')
    : path.join(app.getPath('userData'), 'vicphysio.db');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: BetterSqlite3Wrapper,
    storage: dbPath,
    logging: false,
    models: [ClienteModel, FichaModel],
  });

  await sequelize.sync();

  return sequelize;
}

export function getSequelize(): Sequelize {
  if (!sequelize) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return sequelize;
}
