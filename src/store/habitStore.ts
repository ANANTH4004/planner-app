import { create } from 'zustand'
import { Habit } from '../domain/types'
import {
  createHabit,
  fetchHabitsWithStreak,
  getLogMapForHabit,
  toggleHabitForDate as toggleHabitForDateService,
  toggleHabitForToday,
} from '../services/habitService'

type EnrichedHabit = Habit & {
  streak: number
  completedToday: boolean
}

interface HabitState {
  habits: EnrichedHabit[]
  currentHabitLogMap: Record<string, number>
  loadHabits: () => Promise<void>
  addHabit: (title: string) => Promise<void>
  toggleHabit: (habitId: string) => Promise<void>
  toggleHabitForDate: (habitId: string, date: string) => Promise<void>
  viewHabitHistory: (habitId: string) => Promise<void>
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  currentHabitLogMap: {},

  loadHabits: async () => {
    const habits = await fetchHabitsWithStreak()
    set({ habits })
  },

  addHabit: async (title: string) => {
    await createHabit(title)
    const habits = await fetchHabitsWithStreak()
    set({ habits })
  },

  toggleHabit: async (habitId: string) => {
    await toggleHabitForToday(habitId)
    const habits = await fetchHabitsWithStreak()
    set({ habits })
  },

  viewHabitHistory: async (habitId: string) => {
    const logMap = await getLogMapForHabit(habitId)
    set({ currentHabitLogMap: logMap })
  },

  toggleHabitForDate: async (habitId: string, date: string) => {
    await toggleHabitForDateService(habitId, date)

    const [logMap, habits] = await Promise.all([
      getLogMapForHabit(habitId),
      fetchHabitsWithStreak(),
    ])

    set({
      currentHabitLogMap: logMap,
      habits,
    })
  },
}))
