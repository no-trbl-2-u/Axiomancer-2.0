import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import { User, UserCreateInput } from '../types';

export class DatabaseService {
  private static sqliteDb: sqlite3.Database | null = null;
  private static pgPool: Pool | null = null;

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
    const { email, password, firstName, lastName } = userData;
    
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        const stmt = this.sqliteDb!.prepare(`
          INSERT INTO users (email, password, first_name, last_name)
          VALUES (?, ?, ?, ?)
        `);
        
        stmt.run([email, password, firstName, lastName], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          // Get the created user
          DatabaseService.getUserById(this.lastID).then(resolve).catch(reject);
        });
        
        stmt.finalize();
      });
    } else if (this.pgPool) {
      const result = await this.pgPool.query(
        'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, password, firstName, lastName]
      );
      return this.mapRowToUser(result.rows[0]);
    }
    
    throw new Error('Database not initialized');
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.get(
          'SELECT * FROM users WHERE email = ?',
          [email],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row ? this.mapRowToUser(row) : null);
          }
        );
      });
    } else if (this.pgPool) {
      const result = await this.pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
    }
    
    throw new Error('Database not initialized');
  }

  static async getUserById(id: number): Promise<User> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.get(
          'SELECT * FROM users WHERE id = ?',
          [id],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            if (!row) {
              reject(new Error('User not found'));
              return;
            }
            resolve(this.mapRowToUser(row));
          }
        );
      });
    } else if (this.pgPool) {
      const result = await this.pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (!result.rows[0]) {
        throw new Error('User not found');
      }
      return this.mapRowToUser(result.rows[0]);
    }
    
    throw new Error('Database not initialized');
  }

  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}