import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import BetterSqlite3Wrapper, {
  toBindableValue,
  arrayToNamedParams,
  toBindableParams,
  Database,
} from './better-sqlite3-wrapper';

// Helper to promisify callback-based methods
function promisify<T>(
  fn: (callback: (err: Error | null, result?: T) => void) => void
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function promisifyVoid(fn: (callback: (err: Error | null) => void) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    fn((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

describe('better-sqlite3-wrapper', () => {
  describe('toBindableValue', () => {
    it('returns null for null', () => {
      expect(toBindableValue(null)).toBe(null);
    });

    it('returns null for undefined', () => {
      expect(toBindableValue(undefined)).toBe(null);
    });

    it('converts Date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      expect(toBindableValue(date)).toBe('2024-01-15T10:30:00.000Z');
    });

    it('converts true to 1', () => {
      expect(toBindableValue(true)).toBe(1);
    });

    it('converts false to 0', () => {
      expect(toBindableValue(false)).toBe(0);
    });

    it('converts object to JSON string', () => {
      const obj = { name: 'test', value: 123 };
      expect(toBindableValue(obj)).toBe('{"name":"test","value":123}');
    });

    it('passes through strings', () => {
      expect(toBindableValue('hello')).toBe('hello');
    });

    it('passes through numbers', () => {
      expect(toBindableValue(42)).toBe(42);
      expect(toBindableValue(3.14)).toBe(3.14);
    });

    it('passes through bigints', () => {
      expect(toBindableValue(BigInt(9007199254740991))).toBe(BigInt(9007199254740991));
    });
  });

  describe('arrayToNamedParams', () => {
    it('converts empty array to empty object', () => {
      expect(arrayToNamedParams([])).toEqual({});
    });

    it('converts single element array', () => {
      expect(arrayToNamedParams(['value1'])).toEqual({ '1': 'value1' });
    });

    it('converts multiple element array with correct indices', () => {
      expect(arrayToNamedParams(['a', 'b', 'c'])).toEqual({
        '1': 'a',
        '2': 'b',
        '3': 'c',
      });
    });

    it('applies toBindableValue to each element', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = arrayToNamedParams(['string', 42, date, true, null]);
      expect(result).toEqual({
        '1': 'string',
        '2': 42,
        '3': '2024-01-15T10:30:00.000Z',
        '4': 1,
        '5': null,
      });
    });
  });

  describe('toBindableParams', () => {
    it('converts empty object to empty object', () => {
      expect(toBindableParams({})).toEqual({});
    });

    it('preserves keys and converts values', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = toBindableParams({
        '1': 'string',
        '2': date,
        '3': true,
        nome: 'João',
      });
      expect(result).toEqual({
        '1': 'string',
        '2': '2024-01-15T10:30:00.000Z',
        '3': 1,
        nome: 'João',
      });
    });
  });

  describe('DatabaseWrapper', () => {
    let db: InstanceType<typeof Database>;

    beforeEach(() => {
      db = new Database(':memory:');
      // Create test table synchronously via exec
      db.exec('CREATE TABLE test (id TEXT PRIMARY KEY, name TEXT, value INTEGER, created_at TEXT)');
    });

    afterEach(() => {
      db.close();
    });

    describe('run()', () => {
      it('executes INSERT with array parameters', async () => {
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, value) VALUES ($1, $2, $3)', ['id1', 'test', 42], cb)
        );
        // Verify insert worked
        const row = await promisify<{ id: string }>((cb) =>
          db.get('SELECT * FROM test WHERE id = $1', ['id1'], cb)
        );
        expect(row?.id).toBe('id1');
      });

      it('executes INSERT with object parameters', async () => {
        await promisifyVoid((cb) =>
          db.run(
            'INSERT INTO test (id, name, value) VALUES ($1, $2, $3)',
            { '1': 'id1', '2': 'test', '3': 42 },
            cb
          )
        );
        const row = await promisify<{ id: string }>((cb) =>
          db.get('SELECT * FROM test WHERE id = $1', ['id1'], cb)
        );
        expect(row?.id).toBe('id1');
      });

      it('executes INSERT with Date value', async () => {
        const date = new Date('2024-01-15T10:30:00.000Z');
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, created_at) VALUES ($1, $2, $3)', ['id1', 'test', date], cb)
        );
        const row = await promisify<{ created_at: string }>((cb) =>
          db.get('SELECT created_at FROM test WHERE id = $1', ['id1'], cb)
        );
        expect(row?.created_at).toBe('2024-01-15T10:30:00.000Z');
      });

      it('executes without parameters', async () => {
        // First insert something
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name) VALUES ($1, $2)', ['id1', 'test'], cb)
        );
        // Then delete all
        await promisifyVoid((cb) => db.run('DELETE FROM test', undefined, cb));
        const rows = await promisify<unknown[]>((cb) => db.all('SELECT * FROM test', undefined, cb));
        expect(rows).toHaveLength(0);
      });
    });

    describe('all()', () => {
      beforeEach(async () => {
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, value) VALUES ($1, $2, $3)', ['id1', 'first', 1], cb)
        );
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, value) VALUES ($1, $2, $3)', ['id2', 'second', 2], cb)
        );
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, value) VALUES ($1, $2, $3)', ['id3', 'third', 3], cb)
        );
      });

      it('returns all rows without parameters', async () => {
        const rows = await promisify<unknown[]>((cb) =>
          db.all('SELECT * FROM test ORDER BY id', undefined, cb)
        );
        expect(rows).toHaveLength(3);
      });

      it('returns filtered rows with array parameters', async () => {
        const rows = await promisify<unknown[]>((cb) =>
          db.all('SELECT * FROM test WHERE value > $1', [1], cb)
        );
        expect(rows).toHaveLength(2);
      });

      it('returns filtered rows with object parameters', async () => {
        const rows = await promisify<{ id: string }[]>((cb) =>
          db.all('SELECT * FROM test WHERE name = $1', { '1': 'second' }, cb)
        );
        expect(rows).toHaveLength(1);
        expect(rows?.[0].id).toBe('id2');
      });
    });

    describe('get()', () => {
      beforeEach(async () => {
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name, value) VALUES ($1, $2, $3)', ['id1', 'first', 1], cb)
        );
      });

      it('returns single row with array parameters', async () => {
        const row = await promisify<{ name: string }>((cb) =>
          db.get('SELECT * FROM test WHERE id = $1', ['id1'], cb)
        );
        expect(row).toBeDefined();
        expect(row?.name).toBe('first');
      });

      it('returns single row with object parameters', async () => {
        const row = await promisify<{ name: string }>((cb) =>
          db.get('SELECT * FROM test WHERE id = $1', { '1': 'id1' }, cb)
        );
        expect(row).toBeDefined();
        expect(row?.name).toBe('first');
      });

      it('returns undefined for no match', async () => {
        const row = await promisify<unknown>((cb) =>
          db.get('SELECT * FROM test WHERE id = $1', ['nonexistent'], cb)
        );
        expect(row).toBeUndefined();
      });
    });

    describe('exec()', () => {
      it('executes multiple statements', async () => {
        await promisifyVoid((cb) =>
          db.exec(
            `INSERT INTO test (id, name) VALUES ('a', 'first');
             INSERT INTO test (id, name) VALUES ('b', 'second');`,
            cb
          )
        );
        const rows = await promisify<unknown[]>((cb) => db.all('SELECT * FROM test', undefined, cb));
        expect(rows).toHaveLength(2);
      });
    });

    describe('error handling', () => {
      it('calls callback with error for invalid SQL', async () => {
        await expect(
          promisifyVoid((cb) => db.run('INVALID SQL STATEMENT', undefined, cb))
        ).rejects.toThrow();
      });

      it('calls callback with error for constraint violation', async () => {
        await promisifyVoid((cb) =>
          db.run('INSERT INTO test (id, name) VALUES ($1, $2)', ['id1', 'first'], cb)
        );
        await expect(
          promisifyVoid((cb) =>
            db.run('INSERT INTO test (id, name) VALUES ($1, $2)', ['id1', 'duplicate'], cb)
          )
        ).rejects.toThrow();
      });
    });
  });

  describe('exports', () => {
    it('exports Database class', () => {
      expect(Database).toBeDefined();
    });

    it('exports default with Database and constants', () => {
      expect(BetterSqlite3Wrapper.Database).toBeDefined();
      expect(BetterSqlite3Wrapper.OPEN_READONLY).toBe(1);
      expect(BetterSqlite3Wrapper.OPEN_READWRITE).toBe(2);
      expect(BetterSqlite3Wrapper.OPEN_CREATE).toBe(4);
    });
  });
});
