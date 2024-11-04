import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../components/ThemeContext';
import { Calendar } from 'react-native-calendars';

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

  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync("habits.db");
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
      setMarkedDates(generateMarkedDates(fetchedRecords));
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error inesperado";
      Alert.alert("Error al obtener el progreso", errorMessage);
    }
  };

  const generateMarkedDates = (records: { date: string; completed: number; }[]) => {
    const marked = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    records.forEach(record => {
      const date = record.date;
      if (record.completed === 1) {
        marked[date] = { marked: true, dotColor: 'green' }; // Color verde para completado
      } else {
        // Marcar solo si fue un día que se esperaba haber completado
        const recordDate = new Date(date);
        const dayOfWeek = daysOfWeek[recordDate.getDay()];
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']; // Localización en español
        if (days.includes(dayOfWeek)) {
          marked[date] = { marked: true, dotColor: 'red' }; // Color rojo para no completado
        }
      }
    });

    return marked;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, currentTheme.container]}>
        <Text style={[styles.title, currentTheme.text]}>Progreso del Hábito</Text>
        <Calendar
          current={new Date().toISOString().split('T')[0]} // Fecha actual
          markedDates={markedDates}
          style={styles.calendar}
        />
        <View style={styles.colorReference}>
          <Text style={[styles.referenceText, currentTheme.text]}>
            <Text style={{ color: 'green' }}>⬤</Text> Completado
          </Text>
          <Text style={[styles.referenceText, currentTheme.text]}>
            <Text style={{ color: 'red' }}>⬤</Text> No Completado
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  colorReference: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  referenceText: {
    fontSize: 16,
  },
});

export default ProgressHabit;