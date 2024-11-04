import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../components/ThemeContext';

type RootStackParamList = {
  progressHabit: { habitId: string };
};

type ProgressHabitNavigationProp = StackNavigationProp<RootStackParamList, 'progressHabit'>;
type ProgressHabitRouteProp = RouteProp<RootStackParamList, 'progressHabit'>;

const ProgressHabit: React.FC = () => {
  const navigation = useNavigation<ProgressHabitNavigationProp>();
  const route = useRoute<ProgressHabitRouteProp>();
  const { habitId } = route.params || {};
  const { currentTheme } = useTheme();

  const [progressRecords, setProgressRecords] = useState<{ date: string; completed: number; }[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync("habits.db");
      setDb(database);
      fetchProgressRecords(database);
    };

    initDb();
  }, []);

  const fetchProgressRecords = async (database: SQLite.SQLiteDatabase) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "No se encontró el usuario autenticado");
      return;
    }

    const userId = currentUser.uid;

    try {
      const results = await database.getAllAsync(
        'SELECT * FROM habit_progress WHERE habit_id = ? ORDER BY date DESC',
        [habitId]
      );
      const fetchedRecords = results as { date: string; completed: number; }[];
      setProgressRecords(fetchedRecords);
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error inesperado";
      Alert.alert("Error al obtener el progreso", errorMessage);
    }
  };

  return (
    <View style={[styles.container, currentTheme.container]}>
      <Text style={[styles.title, currentTheme.text]}>Progreso del Hábito</Text>
      <FlatList
        data={progressRecords}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={[styles.recordContainer, currentTheme.recordContainer]}>
            <Text style={[styles.recordText, currentTheme.text]}>
              Fecha: {item.date} - {item.completed === 1 ? 'Completado' : 'No Completado'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recordContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
  },
  recordText: {
    fontSize: 16,
  },
});

export default ProgressHabit;