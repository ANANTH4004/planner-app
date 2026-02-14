import dayjs from 'dayjs'
import { HabitLog } from './types'

export const calculateCurrentStreak = (logs: HabitLog[]): number => {
  if (!logs.length) return 0

  // Ensure sorted DESC by date
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date))

  let streak = 0
  let currentDate = dayjs().format('YYYY-MM-DD')

  for (const log of sorted) {
    if (log.date === currentDate && log.completed_count > 0) {
      streak++
      currentDate = dayjs(currentDate).subtract(1, 'day').format('YYYY-MM-DD')
    } else if (log.date === currentDate) {
      break
    } else if (log.date < currentDate) {
      break
    }
  }

  return streak
}

interface StreakResult {
  currentStreak: number
  longestStreak: number
}

export const calculateStreaks = (logs: HabitLog[]): StreakResult => {
  if (!logs.length) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Only consider completed days
  const completedDates = logs
    .filter((l) => l.completed_count > 0)
    .map((l) => l.date)
    .sort() // ascending

  if (!completedDates.length) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let longest = 1
  let current = 1
  let temp = 1

  for (let i = 1; i < completedDates.length; i++) {
    const prev = dayjs(completedDates[i - 1])
    const curr = dayjs(completedDates[i])

    const diff = curr.diff(prev, 'day')

    if (diff === 1) {
      temp++
      longest = Math.max(longest, temp)
    } else {
      temp = 1
    }
  }

  // Now calculate CURRENT streak from today backwards
  let todayDate = dayjs().startOf('day')
  current = 0

  while (true) {
    const dateStr = todayDate.format('YYYY-MM-DD')

    if (completedDates.includes(dateStr)) {
      current++
      todayDate = todayDate.subtract(1, 'day')
    } else {
      break
    }
  }

  return {
    currentStreak: current,
    longestStreak: longest,
  }
}
