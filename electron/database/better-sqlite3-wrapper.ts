import BetterSqlite3, { Database as BetterSqlite3Database } from 'better-sqlite3';

/**
 * Convert a value to a SQLite-bindable type.
 * SQLite3 can only bind: numbers, strings, bigints, buffers, and null.
 */
export function toBindableValue(value: unknown): unknown {
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
export function arrayToNamedParams(params: unknown[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < params.length; i++) {
    result[(i + 1).toString()] = toBindableValue(params[i]);
  }
  return result;
}

/**
 * Convert object parameters, applying toBindableValue to each value.
 * Sequelize passes params as { "$1": val1, "$2": val2 } but better-sqlite3
 * expects { "1": val1, "2": val2 } (without dollar sign).
 */
export function toBindableParams(params: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in params) {
    // Strip leading $ from keys (Sequelize uses $1, $2 but better-sqlite3 expects 1, 2)
    const cleanKey = key.startsWith('$') ? key.slice(1) : key;
    result[cleanKey] = toBindableValue(params[key]);
  }
  return result;
}

type BindParams = unknown[] | Record<string, unknown>;

/**
 * Prepare parameters for better-sqlite3.
 * Handles both array and object parameter formats from Sequelize.
 */
function prepareParams(params: BindParams | undefined): Record<string, unknown> | undefined {
  if (!params) return undefined;

  if (Array.isArray(params)) {
    if (params.length === 0) return undefined;
    return arrayToNamedParams(params);
  }

  if (typeof params === 'object' && Object.keys(params).length > 0) {
    return toBindableParams(params);
  }

  return undefined;
}

/**
 * Wrapper that adapts better-sqlite3 to the sqlite3 callback-based API
 * that Sequelize v6 expects.
 *
 * Sequelize calls: conn.run(sql, parameters, callback)
 * Where parameters can be an array or object.
 */
class DatabaseWrapper {
  private db!: BetterSqlite3Database;

  constructor(filename: string, _mode?: number, callback?: (err: Error | null) => void) {
    try {
      this.db = new BetterSqlite3(filename);
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

  run(sql: string, params?: BindParams | ((err: Error | null) => void), callback?: (err: Error | null) => void): this {
    // Handle case where params is actually the callback (called as db.run(sql, callback))
    let actualParams: BindParams | undefined;
    let actualCallback: ((err: Error | null) => void) | undefined;

    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = undefined;
    } else {
      actualParams = params;
      actualCallback = callback;
    }

    try {
      const stmt = this.db.prepare(sql);
      const bindParams = prepareParams(actualParams);
      if (bindParams) {
        stmt.run(bindParams);
      } else {
        stmt.run();
      }
      if (actualCallback) process.nextTick(() => actualCallback!(null));
    } catch (error) {
      if (actualCallback) process.nextTick(() => actualCallback!(error as Error));
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

  all(sql: string, params?: BindParams | ((err: Error | null, rows?: unknown[]) => void), callback?: (err: Error | null, rows?: unknown[]) => void): void {
    // Handle case where params is actually the callback (called as db.all(sql, callback))
    let actualParams: BindParams | undefined;
    let actualCallback: ((err: Error | null, rows?: unknown[]) => void) | undefined;

    if (typeof params === 'function') {
      actualCallback = params as (err: Error | null, rows?: unknown[]) => void;
      actualParams = undefined;
    } else {
      actualParams = params;
      actualCallback = callback;
    }

    try {
      const stmt = this.db.prepare(sql);
      const bindParams = prepareParams(actualParams);

      if (stmt.reader) {
        const rows = bindParams ? stmt.all(bindParams) : stmt.all();
        if (actualCallback) process.nextTick(() => actualCallback!(null, rows));
      } else {
        // Non-SELECT statement
        if (bindParams) {
          stmt.run(bindParams);
        } else {
          stmt.run();
        }
        if (actualCallback) process.nextTick(() => actualCallback!(null, []));
      }
    } catch (error) {
      if (actualCallback) process.nextTick(() => actualCallback!(error as Error));
    }
  }

  get(sql: string, params?: BindParams | ((err: Error | null, row?: unknown) => void), callback?: (err: Error | null, row?: unknown) => void): void {
    // Handle case where params is actually the callback (called as db.get(sql, callback))
    let actualParams: BindParams | undefined;
    let actualCallback: ((err: Error | null, row?: unknown) => void) | undefined;

    if (typeof params === 'function') {
      actualCallback = params as (err: Error | null, row?: unknown) => void;
      actualParams = undefined;
    } else {
      actualParams = params;
      actualCallback = callback;
    }

    try {
      const stmt = this.db.prepare(sql);
      const bindParams = prepareParams(actualParams);

      if (stmt.reader) {
        const row = bindParams ? stmt.get(bindParams) : stmt.get();
        if (actualCallback) process.nextTick(() => actualCallback!(null, row));
      } else {
        // Non-SELECT statement
        if (bindParams) {
          stmt.run(bindParams);
        } else {
          stmt.run();
        }
        if (actualCallback) process.nextTick(() => actualCallback!(null, undefined));
      }
    } catch (error) {
      if (actualCallback) process.nextTick(() => actualCallback!(error as Error));
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
