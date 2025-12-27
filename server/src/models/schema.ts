import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { logger } from '../utils/logger.js';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  try {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    logger.debug(`Connected to SQLite database at ${dbPath}`);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        referrer_id INTEGER,
        FOREIGN KEY (referrer_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    logger.debug('Database tables initialized');
    return db;
  } catch (error) {
    logger.error({ error }, 'Database connection/initialization failed:');
    throw error;
  }
}
