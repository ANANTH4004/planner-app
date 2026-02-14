import { useColorScheme } from '@/hooks/use-color-scheme'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import dayjs from 'dayjs'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { runMigrations } from '@/src/database/migration'
import { getDatabase } from '../src/database/db'
import { getAllHabits, insertHabit } from '../src/database/habitRepository'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const db = await getDatabase()
      await runMigrations(db)

      // TEMP TEST
      await insertHabit({
        id: uuidv4(),
        title: 'Test Habit',
        description: '',
        color: '#00FF00',
        icon: 'check',
        frequency_type: 'daily',
        target_count: 1,
        reminder_time: null,
        created_at: dayjs().format('YYYY-MM-DD'),
        archived: 0,
      })

      const habits = await getAllHabits()
      console.log('Habits:', habits)

      setDbReady(true)
    }

    init()
  }, [])

  if (!dbReady) return null

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
