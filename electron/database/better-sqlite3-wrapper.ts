import BetterSqlite3, { Database as BetterSqlite3Database } from 'better-sqlite3';

/**
 * Wrapper that adapts better-sqlite3 to the sqlite3 callback-based API
 * that Sequelize v6 expects.
 */
class DatabaseWrapper {
  private db!: BetterSqlite3Database;

  constructor(filename: string, _mode?: number, callback?: (err: Error | null) => void) {
    try {
      // better-sqlite3 is synchronous, so we just open the database
      this.db = new BetterSqlite3(filename);

      // Call callback on next tick to simulate async behavior
      if (callback) {
        process.nextTick(() => callback(null));
      }
    } catch (error) {
      if (callback) {
        process.nextTick(() => callback(error as Error));
      } else {
        throw error;
      }
    }
  }

  run(sql: string, ...params: unknown[]): this {
    const callback = typeof params[params.length - 1] === 'function'
      ? params.pop() as (err: Error | null) => void
      : undefined;

    try {
      this.db.exec(sql);
      if (callback) process.nextTick(() => callback(null));
    } catch (error) {
      if (callback) process.nextTick(() => callback(error as Error));
      else throw error;
    }
    return this;
  }

  exec(sql: string, callback?: (err: Error | null) => void): this {
    try {
      this.db.exec(sql);
      if (callback) process.nextTick(() => callback(null));
    } catch (error) {
      if (callback) process.nextTick(() => callback(error as Error));
      else throw error;
    }
    return this;
  }

  all(sql: string, ...params: unknown[]): void {
    const callback = params.pop() as (err: Error | null, rows?: unknown[]) => void;
    const bindParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

    try {
      const stmt = this.db.prepare(sql);
      const rows = bindParams.length > 0 ? stmt.all(...bindParams) : stmt.all();
      process.nextTick(() => callback(null, rows));
    } catch (error) {
      process.nextTick(() => callback(error as Error));
    }
  }

  get(sql: string, ...params: unknown[]): void {
    const callback = params.pop() as (err: Error | null, row?: unknown) => void;
    const bindParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

    try {
      const stmt = this.db.prepare(sql);
      const row = bindParams.length > 0 ? stmt.get(...bindParams) : stmt.get();
      process.nextTick(() => callback(null, row));
    } catch (error) {
      process.nextTick(() => callback(error as Error));
    }
  }

  close(callback?: (err: Error | null) => void): void {
    try {
      this.db.close();
      if (callback) process.nextTick(() => callback(null));
    } catch (error) {
      if (callback) process.nextTick(() => callback(error as Error));
      else throw error;
    }
  }

  serialize(callback?: () => void): void {
    // better-sqlite3 is already synchronous, so serialize is a no-op
    if (callback) callback();
  }

  parallelize(callback?: () => void): void {
    // better-sqlite3 is already synchronous
    if (callback) callback();
  }
}

// Export in the format Sequelize expects
export const Database = DatabaseWrapper;

// These constants are used by Sequelize for file mode
export const OPEN_READONLY = 1;
export const OPEN_READWRITE = 2;
export const OPEN_CREATE = 4;

export default {
  Database: DatabaseWrapper,
  OPEN_READONLY,
  OPEN_READWRITE,
  OPEN_CREATE,
};
