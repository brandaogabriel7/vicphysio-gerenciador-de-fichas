import BetterSqlite3, { Database as BetterSqlite3Database } from 'better-sqlite3';

/**
 * Convert a value to a SQLite-bindable type.
 * SQLite3 can only bind: numbers, strings, bigints, buffers, and null.
 */
function toBindableValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'object' && !(value instanceof Buffer)) {
    return JSON.stringify(value);
  }
  return value;
}

/**
 * Convert array of parameters to object for better-sqlite3 named parameters.
 * Sequelize uses $1, $2, etc. which better-sqlite3 treats as named params.
 */
function arrayToNamedParams(params: unknown[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < params.length; i++) {
    result[(i + 1).toString()] = toBindableValue(params[i]);
  }
  return result;
}

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
    const bindParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

    try {
      const stmt = this.db.prepare(sql);
      if (bindParams.length > 0) {
        // Convert array to named params object for $1, $2, etc. placeholders
        stmt.run(arrayToNamedParams(bindParams as unknown[]));
      } else {
        stmt.run();
      }
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
      // Check if statement returns data
      if (stmt.reader) {
        // Convert array to named params object for $1, $2, etc. placeholders
        const rows = bindParams.length > 0
          ? stmt.all(arrayToNamedParams(bindParams as unknown[]))
          : stmt.all();
        process.nextTick(() => callback(null, rows));
      } else {
        // Non-SELECT statement, run it and return empty array
        if (bindParams.length > 0) {
          stmt.run(arrayToNamedParams(bindParams as unknown[]));
        } else {
          stmt.run();
        }
        process.nextTick(() => callback(null, []));
      }
    } catch (error) {
      process.nextTick(() => callback(error as Error));
    }
  }

  get(sql: string, ...params: unknown[]): void {
    const callback = params.pop() as (err: Error | null, row?: unknown) => void;
    const bindParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

    try {
      const stmt = this.db.prepare(sql);
      // Check if statement returns data
      if (stmt.reader) {
        // Convert array to named params object for $1, $2, etc. placeholders
        const row = bindParams.length > 0
          ? stmt.get(arrayToNamedParams(bindParams as unknown[]))
          : stmt.get();
        process.nextTick(() => callback(null, row));
      } else {
        // Non-SELECT statement, run it and return undefined
        if (bindParams.length > 0) {
          stmt.run(arrayToNamedParams(bindParams as unknown[]));
        } else {
          stmt.run();
        }
        process.nextTick(() => callback(null, undefined));
      }
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
