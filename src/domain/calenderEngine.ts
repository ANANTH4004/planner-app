import dayjs from 'dayjs'

export type DayStatus = 'completed' | 'missed' | 'future' | 'empty'

export const getDayStatus = (
  date: string,
  logMap: Record<string, number>
): DayStatus => {
  const today = dayjs().format('YYYY-MM-DD')

  if (date > today) return 'future'

  if (logMap[date] && logMap[date] > 0) return 'completed'

  if (date < today) return 'missed'

  return 'empty'
}
