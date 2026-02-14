import dayjs from 'dayjs'

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import {
  getLogByHabitAndDate,
  getLogsByHabit,
  upsertHabitLog,
} from '../database/habitLogRepository'
import { getAllHabits, insertHabit } from '../database/habitRepository'
import { calculateStreaks } from '../domain/streakEngine'
import { Habit } from '../domain/types'
import { today } from '../utils/dateUtils'

export const createHabit = async (title: string) => {
  const habit: Habit = {
    id: uuidv4(),
    title,
    description: '',
    color: '#00FF00',
    icon: 'check',
    frequency_type: 'daily',
    target_count: 1,
    reminder_time: null,
    created_at: dayjs().format('YYYY-MM-DD'),
    archived: 0,
  }

  await insertHabit(habit)
}

// export const fetchHabitsWithStreak = async () => {
//   const habits = await getAllHabits()

//   const enriched = await Promise.all(
//     habits.map(async (habit) => {
//       const logs = await getLogsByHabit(habit.id)
//       const streak = calculateCurrentStreak(logs)

//       return {
//         ...habit,
//         streak,
//       }
//     })
//   )

//   return enriched
// }

export const toggleHabitForToday = async (habitId: string) => {
  const currentDate = today()

  const existingLog = await getLogByHabitAndDate(habitId, currentDate)

  if (!existingLog) {
    // Not completed yet → mark complete
    await upsertHabitLog({
      id: uuidv4(),
      habit_id: habitId,
      date: currentDate,
      completed_count: 1,
      note: null,
    })
  } else {
    // Already exists → toggle
    const newCount = existingLog.completed_count > 0 ? 0 : 1

    await upsertHabitLog({
      id: existingLog.id,
      habit_id: existingLog.habit_id,
      date: existingLog.date,
      completed_count: newCount,
      note: existingLog.note ?? null,
    })
  }
}

export const fetchHabitsWithStreak = async () => {
  const habits = await getAllHabits()

  const enriched = await Promise.all(
    habits.map(async (habit) => {
      const logs = await getLogsByHabit(habit.id)

      const { currentStreak, longestStreak } = calculateStreaks(logs)

      const isCompletedToday = logs.some(
        (log) => log.date === today() && log.completed_count > 0,
      )

      return {
        ...habit,
        streak: currentStreak,
        longestStreak,
        completedToday: isCompletedToday,
      }
    }),
  )

  return enriched
}

export const toggleHabitForDate = async (habitId: string, date: string) => {
  const existingLog = await getLogByHabitAndDate(habitId, date)

  if (!existingLog) {
    await upsertHabitLog({
      id: uuidv4(),
      habit_id: habitId,
      date,
      completed_count: 1,
      note: null,
    })
  } else {
    await upsertHabitLog({
      id: existingLog.id,
      habit_id: existingLog.habit_id,
      date: existingLog.date,
      completed_count: existingLog.completed_count > 0 ? 0 : 1,
      note: existingLog.note ?? null,
    })
  }
}

export const getLogMapForHabit = async (habitId: string) => {
  const logs = await getLogsByHabit(habitId)

  const map: Record<string, number> = {}

  logs.forEach((log) => {
    map[log.date] = log.completed_count
  })

  return map
}
