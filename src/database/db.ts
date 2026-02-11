// src/database/db.ts

import * as SQLite from 'expo-sqlite'

let database: SQLite.SQLiteDatabase | null = null

export const getDatabase = async () => {
  if (!database) {
    database = await SQLite.openDatabaseAsync('habits.db')
  }
  return database
}
