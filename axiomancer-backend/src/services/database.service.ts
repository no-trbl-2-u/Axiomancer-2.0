import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import { User, UserCreateInput } from '../types';
import { 
  pipe, 
  pipeAsync, 
  tryCatchAsync, 
  maybe, 
  maybeAsync, 
  ifElse,
  isNil,
  curry,
  prop
} from '../utilities/functional.utils';
import { 
  transformDatabaseResultsTransducer,
  processUserBatch,
  transduce
} from '../utilities/transducers.utils';

export class DatabaseService {
  private static sqliteDb: sqlite3.Database | null = null;
  private static pgPool: Pool | null = null;

  // Functional helpers for database operations
  private static executeQuery = curry((query: string, params: any[], executor: any) => {
    return new Promise((resolve, reject) => {
      executor(query, params, (err: Error, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  private static getSQLiteExecutor = () => this.sqliteDb;
  private static getPostgresExecutor = () => this.pgPool;

  private static getDatabaseExecutor = ifElse(
    () => process.env.NODE_ENV === 'development',
    this.getSQLiteExecutor,
    this.getPostgresExecutor
  );

  private static handleDatabaseError = (operation: string) => (error: any) => {
    throw new Error(`Database ${operation} failed: ${error.message}`);
  };

  static async initialize(): Promise<void> {
    const environment = process.env.NODE_ENV || 'development';
    
    if (environment === 'development') {
      await this.initializeSQLite();
    } else {
      await this.initializePostgres();
    }
  }

  private static async initializeSQLite(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sqliteDb = new sqlite3.Database('./database.sqlite', (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Connected to SQLite database');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  private static async initializePostgres(): Promise<void> {
    this.pgPool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    try {
      await this.pgPool.query('SELECT 1');
      console.log('Connected to PostgreSQL database');
      await this.createTables();
    } catch (error) {
      throw new Error(`Failed to connect to PostgreSQL: ${error}`);
    }
  }

  private static async createTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.run(createUsersTable, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (this.pgPool) {
      const pgCreateUsersTable = createUsersTable
        .replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY')
        .replace('DATETIME', 'TIMESTAMP');
      await this.pgPool.query(pgCreateUsersTable);
    }
  }

  static async createUser(userData: UserCreateInput): Promise<User> {
    try {
      const result = await this.executeCreateUser(userData);
      return await this.handleCreateUserResult(result, userData);
    } catch (error) {
      throw this.handleDatabaseError('createUser')(error);
    }
  }

  private static async executeCreateUser(userData: UserCreateInput): Promise<any> {
    const { email, password, firstName, lastName } = userData;
    const params = [email, password, firstName, lastName];
    
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        const stmt = this.sqliteDb!.prepare(`
          INSERT INTO users (email, password, first_name, last_name)
          VALUES (?, ?, ?, ?)
        `);
        
        stmt.run(params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        });
        
        stmt.finalize();
      });
    } else if (this.pgPool) {
      return this.pgPool.query(
        'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        params
      );
    }
    
    throw new Error('Database not initialized');
  }

  private static async handleCreateUserResult(result: any, userData: UserCreateInput): Promise<User> {
    if (this.sqliteDb && result.lastID) {
      return this.getUserById(result.lastID);
    } else if (this.pgPool && result.rows?.[0]) {
      return this.mapRowToUser(result.rows[0]);
    }
    
    throw new Error('Failed to create user');
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const row = await this.executeUserQuery('SELECT * FROM users WHERE email = ?', 'SELECT * FROM users WHERE email = $1', [email]);
      return row ? this.mapRowToUser(row) : null;
    } catch (error) {
      throw this.handleDatabaseError('getUserByEmail')(error);
    }
  }

  private static async executeUserQuery(sqliteQuery: string, pgQuery: string, params: any[]): Promise<any> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.get(sqliteQuery, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else if (this.pgPool) {
      const result = await this.pgPool.query(pgQuery, params);
      return result.rows[0];
    }
    
    throw new Error('Database not initialized');
  }

  static async getUserById(id: number): Promise<User> {
    try {
      const row = await this.executeUserQuery('SELECT * FROM users WHERE id = ?', 'SELECT * FROM users WHERE id = $1', [id]);
      if (!row) {
        throw new Error('User not found');
      }
      return this.mapRowToUser(row);
    } catch (error) {
      throw this.handleDatabaseError('getUserById')(error);
    }
  }

  // Functional row mapping using composition
  private static mapRowToUser = pipe(
    (row: any) => ({
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })
  );

  // Batch operations using functional patterns
  static async getAllUsers(): Promise<User[]> {
    try {
      if (this.sqliteDb) {
        return new Promise((resolve, reject) => {
          this.sqliteDb!.all('SELECT * FROM users', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(this.mapRowToUser));
          });
        });
      } else if (this.pgPool) {
        const result = await this.pgPool.query('SELECT * FROM users');
        return result.rows.map(this.mapRowToUser);
      }
      throw new Error('Database not initialized');
    } catch (error) {
      throw this.handleDatabaseError('getAllUsers')(error);
    }
  }

  static async getUsersByEmail(emails: string[]): Promise<User[]> {
    try {
      const validEmails = emails.filter(email => email && email.includes('@'))
                                .map(email => email.toLowerCase());
      
      const userPromises = validEmails.map(email => this.getUserByEmail(email));
      const users = await Promise.all(userPromises);
      return users.filter(user => user !== null) as User[];
    } catch (error) {
      throw this.handleDatabaseError('getUsersByEmail')(error);
    }
  }

  static async createUsers(usersData: UserCreateInput[]): Promise<User[]> {
    try {
      const validUsersData = processUserBatch(usersData) as UserCreateInput[];
      const userPromises = validUsersData.map(userData => this.createUser(userData));
      return Promise.all(userPromises);
    } catch (error) {
      throw this.handleDatabaseError('createUsers')(error);
    }
  }
}