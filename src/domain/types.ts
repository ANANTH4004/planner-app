export interface Habit {
  id: string
  title: string
  description?: string
  color?: string
  icon?: string
  frequency_type: 'daily'
  target_count: number
  reminder_time?: string | null
  created_at: string
  archived: number
}

export interface HabitLog {
  id: string
  habit_id: string
  date: string // YYYY-MM-DD
  completed_count: number
  note?: string | null
}
