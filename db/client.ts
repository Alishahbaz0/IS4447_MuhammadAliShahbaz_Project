import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

// Open (or create) the SQLite database file
const sqlite = openDatabaseSync('habit_tracker.db');

// Initialise tables — called once from the root layout on app start
export async function initDatabase() {
  await sqlite.execAsync('PRAGMA foreign_keys = ON;');

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0
    )
  `);

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#0D9488',
      icon TEXT NOT NULL DEFAULT 'pin'
    )
  `);

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL DEFAULT 'daily',
      notes TEXT DEFAULT '',
      created_at INTEGER NOT NULL DEFAULT 0
    )
  `);

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      completed INTEGER NOT NULL DEFAULT 0,
      notes TEXT DEFAULT ''
    )
  `);

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'weekly',
      goal_value INTEGER NOT NULL DEFAULT 5,
      created_at INTEGER NOT NULL DEFAULT 0
    )
  `);
}

// Export the Drizzle ORM instance
export const db = drizzle(sqlite, { schema });