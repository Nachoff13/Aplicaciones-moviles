import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

// Inicializa la base de datos SQLite
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('habits.db');
};

type HabitDetailRouteParams = {
  habitId: string;
};

type HabitDetailScreenProps = {
  route: RouteProp<{ params: HabitDetailRouteParams }, 'params'>;
};

const DetailHabitScreen: React.FC = () => {
  const route = useRoute<HabitDetailScreenProps['route']>();
  const { habitId } = route.params || { habitId: '' };

  const [habit, setHabit] = useState<{ name: string; importance: string } | null>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await openDatabase();
      setDb(database);

      // Crear la tabla si no existe
      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, importance TEXT);"
      );
    };

    initDb();
  }, []);

  useEffect(() => {
    const fetchHabit = async (id: string) => {
      if (!db) return; // Espera a que la base de datos esté disponible

      try {
        const results = await db.execAsync(
          `SELECT name, importance FROM habits WHERE id = ${id}`
        );

        if (results[0].rows.length > 0) {
          const row = results[0].rows.item(0) as { name: string; importance: string };
          setHabit({ name: row.name, importance: row.importance });
        }
      } catch (error) {
        console.error('Error al obtener el hábito:', error);
      }
    };

    if (habitId) {
      fetchHabit(habitId);
    }
  }, [habitId, db]);

  if (!habit) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Hábito</Text>
      <Text>Nombre: {habit.name}</Text>
      <Text>Importancia: {habit.importance}</Text>
      <Button title="Volver" onPress={() => {/* Maneja la navegación hacia atrás */}} />
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
});

export default DetailHabitScreen;