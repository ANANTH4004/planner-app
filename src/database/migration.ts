import { SQLiteDatabase } from 'expo-sqlite'

export const runMigrations = async (db: SQLiteDatabase) => {
  await db.execAsync(`PRAGMA foreign_keys = ON;`)

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `)

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      color TEXT,
      icon TEXT,
      frequency_type TEXT NOT NULL,
      target_count INTEGER DEFAULT 1,
      reminder_time TEXT,
      created_at TEXT NOT NULL,
      archived INTEGER DEFAULT 0
    );
  `)

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed_count INTEGER DEFAULT 0,
      note TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits(id)
    );
  `)

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date
    ON habit_logs (habit_id, date);
  `)
}
