import { Habit } from '../domain/types'
import { getDatabase } from './db'

export const insertHabit = async (habit: Habit) => {
  const db = await getDatabase()

  await db.runAsync(
    `
    INSERT INTO habits
    (id, title, description, color, icon, frequency_type, target_count, reminder_time, created_at, archived)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      habit.id,
      habit.title,
      habit.description ?? null,
      habit.color ?? null,
      habit.icon ?? null,
      habit.frequency_type,
      habit.target_count,
      habit.reminder_time ?? null,
      habit.created_at,
      habit.archived,
    ]
  )
}

export const getAllHabits = async (): Promise<Habit[]> => {
  const db = await getDatabase()

  const result = await db.getAllAsync<Habit>(
    `SELECT * FROM habits WHERE archived = 0 ORDER BY created_at DESC`
  )

  return result
}

export const deleteHabit = async (habitId: string) => {
  const db = await getDatabase()

  await db.runAsync(`DELETE FROM habits WHERE id = ?`, [habitId])
}

export const updateHabit = async (habit: Habit) => {
  const db = await getDatabase()

  await db.runAsync(
    `
    UPDATE habits
    SET title = ?,
        description = ?,
        color = ?,
        icon = ?,
        frequency_type = ?,
        target_count = ?,
        reminder_time = ?,
        archived = ?
    WHERE id = ?
    `,
    [
      habit.title,
      habit.description ?? null,
      habit.color ?? null,
      habit.icon ?? null,
      habit.frequency_type,
      habit.target_count,
      habit.reminder_time ?? null,
      habit.archived,
      habit.id,
    ]
  )
}
