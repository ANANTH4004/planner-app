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
