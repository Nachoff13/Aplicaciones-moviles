import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

// Define el tipo para los parámetros del stack
type RootStackParamList = {
  detailHabit: { habitId: string };

};

// Define el tipo de navegación
type ListHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'detailHabit'>;

const ListHabitScreen: React.FC = () => {
  const navigation = useNavigation<ListHabitScreenNavigationProp>(); // Asigna el tipo de navegación
  const [habits, setHabits] = useState<{ id: string; name: string; importance: string }[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync('habits.db');
      setDb(database);

      // Crear la tabla si no existe
      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, importance TEXT);"
      );
    };

    initDb();
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!db) return;

      try {
        const results = await db.execAsync('SELECT id, name, importance FROM habits;');
        const fetchedHabits = results[0].rows._array;
        setHabits(fetchedHabits);
      } catch (error) {
        console.error('Error al obtener los hábitos:', error);
      }
    };

    fetchHabits();
  }, [db]);

  const handlePress = (habitId: string) => {
    navigation.navigate('detailHabit', { habitId }); // Navegar a la pantalla de detalles
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Hábitos</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.habitContainer}>
            <Text>{item.name}</Text>
            <Text>{item.importance}</Text>
            <Button title="Detalles" onPress={() => handlePress(item.id.toString())} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  habitContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default ListHabitScreen;