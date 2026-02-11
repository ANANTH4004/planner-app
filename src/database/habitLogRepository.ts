import { HabitLog } from '../domain/types'
import { getDatabase } from './db'

export const upsertHabitLog = async (log: HabitLog) => {
  const db = await getDatabase()

  await db.runAsync(
    `
    INSERT INTO habit_logs (id, habit_id, date, completed_count, note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      completed_count = excluded.completed_count,
      note = excluded.note
    `,
    [log.id, log.habit_id, log.date, log.completed_count, log.note ?? null]
  )
}

export const getLogsByHabit = async (habitId: string): Promise<HabitLog[]> => {
  const db = await getDatabase()

  const logs = await db.getAllAsync<HabitLog>(
    `
    SELECT * FROM habit_logs
    WHERE habit_id = ?
    ORDER BY date DESC
    `,
    [habitId]
  )

  return logs
}

export const deleteLogsByHabit = async (habitId: string) => {
  const db = await getDatabase()

  await db.runAsync(`DELETE FROM habit_logs WHERE habit_id = ?`, [habitId])
}
