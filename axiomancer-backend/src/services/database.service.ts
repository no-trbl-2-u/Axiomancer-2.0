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

    const createCharacterStatesTable = `
      CREATE TABLE IF NOT EXISTS character_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        character_data TEXT NOT NULL,
        current_location TEXT NOT NULL,
        current_node TEXT NOT NULL,
        story_data TEXT NOT NULL,
        inventory_data TEXT NOT NULL,
        locations_data TEXT NOT NULL,
        quest_log_data TEXT NOT NULL,
        map_energy INTEGER DEFAULT 100,
        max_map_energy INTEGER DEFAULT 100,
        game_phase TEXT DEFAULT 'exploration',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.run(createUsersTable, (err) => {
          if (err) {
            reject(err);
            return;
          }

          this.sqliteDb!.run(createCharacterStatesTable, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });
    } else if (this.pgPool) {
      const pgCreateUsersTable = createUsersTable
        .replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY')
        .replace('DATETIME', 'TIMESTAMP');

      const pgCreateCharacterStatesTable = createCharacterStatesTable
        .replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY')
        .replace('DATETIME', 'TIMESTAMP');

      await this.pgPool.query(pgCreateUsersTable);
      await this.pgPool.query(pgCreateCharacterStatesTable);
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

  static async saveCharacterState(userId: number, characterState: any): Promise<void> {
    const {
      character,
      currentLocation,
      currentNode,
      story,
      inventory,
      locations,
      questLog,
      mapEnergy,
      maxMapEnergy,
      gamePhase
    } = characterState;

    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        // First check if character state exists
        this.sqliteDb!.get(
          'SELECT id FROM character_states WHERE user_id = ?',
          [userId],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }

            const query = row
              ? `UPDATE character_states SET
                   character_data = ?,
                   current_location = ?,
                   current_node = ?,
                   story_data = ?,
                   inventory_data = ?,
                   locations_data = ?,
                   quest_log_data = ?,
                   map_energy = ?,
                   max_map_energy = ?,
                   game_phase = ?,
                   updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = ?`
              : `INSERT INTO character_states (
                   character_data, current_location, current_node, story_data,
                   inventory_data, locations_data, quest_log_data, map_energy,
                   max_map_energy, game_phase, user_id
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const params = [
              JSON.stringify(character),
              currentLocation,
              currentNode,
              JSON.stringify(story),
              JSON.stringify(inventory),
              JSON.stringify(locations),
              JSON.stringify(questLog),
              mapEnergy,
              maxMapEnergy,
              gamePhase,
              userId
            ];

            this.sqliteDb!.run(query, params, (err) => {
              if (err) reject(err);
              else resolve();
            });
          }
        );
      });
    } else if (this.pgPool) {
      // Check if character state exists
      const existing = await this.pgPool.query(
        'SELECT id FROM character_states WHERE user_id = $1',
        [userId]
      );

      if (existing.rows.length > 0) {
        // Update existing
        await this.pgPool.query(
          `UPDATE character_states SET
             character_data = $1, current_location = $2, current_node = $3,
             story_data = $4, inventory_data = $5, locations_data = $6,
             quest_log_data = $7, map_energy = $8, max_map_energy = $9,
             game_phase = $10, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $11`,
          [
            JSON.stringify(character), currentLocation, currentNode,
            JSON.stringify(story), JSON.stringify(inventory), JSON.stringify(locations),
            JSON.stringify(questLog), mapEnergy, maxMapEnergy, gamePhase, userId
          ]
        );
      } else {
        // Insert new
        await this.pgPool.query(
          `INSERT INTO character_states (
             character_data, current_location, current_node, story_data,
             inventory_data, locations_data, quest_log_data, map_energy,
             max_map_energy, game_phase, user_id
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            JSON.stringify(character), currentLocation, currentNode,
            JSON.stringify(story), JSON.stringify(inventory), JSON.stringify(locations),
            JSON.stringify(questLog), mapEnergy, maxMapEnergy, gamePhase, userId
          ]
        );
      }
    } else {
      throw new Error('Database not initialized');
    }
  }

  static async getCharacterState(userId: number): Promise<any | null> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.get(
          'SELECT * FROM character_states WHERE user_id = ?',
          [userId],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row ? this.mapRowToCharacterState(row) : null);
          }
        );
      });
    } else if (this.pgPool) {
      const result = await this.pgPool.query(
        'SELECT * FROM character_states WHERE user_id = $1',
        [userId]
      );
      return result.rows[0] ? this.mapRowToCharacterState(result.rows[0]) : null;
    }

    throw new Error('Database not initialized');
  }

  static async deleteCharacterState(userId: number): Promise<void> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.run(
          'DELETE FROM character_states WHERE user_id = ?',
          [userId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else if (this.pgPool) {
      await this.pgPool.query('DELETE FROM character_states WHERE user_id = $1', [userId]);
    } else {
      throw new Error('Database not initialized');
    }
  }

  private static mapRowToCharacterState(row: any): any {
    return {
      character: JSON.parse(row.character_data),
      currentLocation: row.current_location,
      currentNode: row.current_node,
      story: JSON.parse(row.story_data),
      inventory: JSON.parse(row.inventory_data),
      locations: JSON.parse(row.locations_data),
      questLog: JSON.parse(row.quest_log_data),
      mapEnergy: row.map_energy,
      maxMapEnergy: row.max_map_energy,
      gamePhase: row.game_phase,
      savedAt: new Date(row.updated_at).getTime()
    };
  }

  /**
   * Clear all data from the database (for development/testing purposes)
   * WARNING: This will delete all users and character states!
   */
  static async clearDatabase(): Promise<void> {
    if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        // Delete in reverse order due to foreign key constraints
        this.sqliteDb!.run('DELETE FROM character_states', (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          this.sqliteDb!.run('DELETE FROM users', (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });
    } else if (this.pgPool) {
      // PostgreSQL will handle cascade deletion automatically
      await this.pgPool.query('DELETE FROM users');
      await this.pgPool.query('DELETE FROM character_states');
    } else {
      throw new Error('Database not initialized');
    }
  }

  /**
   * Get the underlying database connection for direct queries
   */
  static getConnection(): sqlite3.Database | Pool | null {
    return this.sqliteDb || this.pgPool;
  }
}