import dayjs from 'dayjs'

export const generateMonthDates = (year: number, month: number) => {
  const start = dayjs(`${year}-${month}-01`)
  const daysInMonth = start.daysInMonth()

  const dates: string[] = []

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(start.date(i).format('YYYY-MM-DD'))
  }

  return dates
}
