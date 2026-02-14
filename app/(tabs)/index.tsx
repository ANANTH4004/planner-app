import { router } from 'expo-router'
import { useEffect } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useHabitStore } from '../../src/store/habitStore'

export default function HomeScreen() {
  const { habits, loadHabits, toggleHabit } = useHabitStore()

  useEffect(() => {
    loadHabits()
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/habit/${item.id}`)}
            style={{
              backgroundColor: item.completedToday ? '#d4f8d4' : '#fff',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {item.title}
            </Text>

            <Text style={{ marginTop: 4 }}>🔥 Streak: {item.streak}</Text>

            <Text>🏆 Longest: {item.id}</Text>

            <TouchableOpacity
              onPress={() => toggleHabit(item.id)}
              style={{
                marginTop: 10,
                backgroundColor: '#007AFF',
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {item.completedToday ? 'Undo Today' : 'Complete Today'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
