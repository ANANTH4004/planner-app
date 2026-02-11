import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { getDayStatus } from '@/src/domain/calenderEngine'
import { generateMonthDates } from '@/src/utils/calenderUtils'
import { useHabitStore } from '../../src/store/habitStore'

export default function HabitHistoryScreen() {
  const { id } = useLocalSearchParams()
  const habitId = id as string

  const { currentHabitLogMap, viewHabitHistory, toggleHabitForDate } =
    useHabitStore()

  useEffect(() => {
    if (habitId) {
      viewHabitHistory(habitId)
    }
  }, [habitId])

  const dates = generateMonthDates(2026, 2)

  return (
    <View>
      {dates.map((date) => {
        const status = getDayStatus(date, currentHabitLogMap)

        return (
          <TouchableOpacity
            key={date}
            onPress={() => toggleHabitForDate(habitId, date)}
          >
            <Text>
              {date} — {status}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
