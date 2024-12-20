import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../components/ThemeContext';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr',
    'May', 'Jun', 'Jul', 'Ago',
    'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: [
    'Dom', 'Lun', 'Mar', 'Mié',
    'Jue', 'Vie', 'Sáb'
  ],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';


type RootStackParamList = {
  progressHabit: { habitId: string; days: string[] };
};

type ProgressHabitNavigationProp = StackNavigationProp<RootStackParamList, 'progressHabit'>;
type ProgressHabitRouteProp = RouteProp<RootStackParamList, 'progressHabit'>;

const ProgressHabit: React.FC = () => {
  const navigation = useNavigation<ProgressHabitNavigationProp>();
  const route = useRoute<ProgressHabitRouteProp>();
  const { habitId, days } = route.params || {};
  const { theme, currentTheme } = useTheme();

  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync("habits.db");
      fetchProgressRecords(database);
    };

    initDb();
  }, []);

  useEffect(() => {
    setComponentKey(prevKey => prevKey + 1); // Forza el re-render al cambiar el tema
  }, [theme]);

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
      setMarkedDates(generateMarkedDates(fetchedRecords, days));
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error inesperado";
      Alert.alert("Error al obtener el progreso", errorMessage);
    }
  };

  const generateMarkedDates = (records: { date: string; completed: number; }[], days: string[]) => {
    const marked: { [key: string]: any } = {};
    const currentYear = new Date().getFullYear();
    const endOfYear = new Date(currentYear, 11, 31);

    // Marca días donde debe cumplirse el hábito hasta el final del año
    days.forEach(day => {
      const dayIndex = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].indexOf(day);
      if (dayIndex !== -1) {
        let dateToMark = new Date();
        while (dateToMark <= endOfYear) {
          if (dateToMark.getDay() === dayIndex) {
            const formattedDate = dateToMark.toISOString().split('T')[0];
            if (!marked[formattedDate]) {
              marked[formattedDate] = { color: '#9d9d9d', startingDay: true, endingDay: true, selected: true };
            }
          }
          dateToMark.setDate(dateToMark.getDate() + 1);
        }
      }
    });

    // Marca los días completados
    records.forEach(record => {
      const date = record.date;
      const isCompleted = record.completed === 1;
      marked[date] = { color: isCompleted ? '#72ff72' : '#fd5555', startingDay: true, endingDay: true, selected: true };
    });

    return marked;
  };

  return (
    <ScrollView key={componentKey} contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, currentTheme.container]}>
        <Text style={[styles.title, currentTheme.text]}>Progreso del Hábito</Text>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markingType={'period'}
          markedDates={markedDates}
          style={[styles.calendar, currentTheme.container]}
          theme={{
            backgroundColor: currentTheme.container.backgroundColor as string,
            calendarBackground: currentTheme.container.backgroundColor as string,
            textSectionTitleColor: currentTheme.text.color as string,
            dayTextColor: currentTheme.text.color as string,
            monthTextColor: currentTheme.text.color as string,
            todayTextColor: '#007bff',
            selectedDayBackgroundColor: '#007bff',
            selectedDayTextColor: '#ffffff',
            arrowColor: currentTheme.text.color as string,
          }}
          locale={'es'}
        />
        <View style={styles.colorReference}>
          <Text style={[styles.referenceText, currentTheme.text]}>
            <Text style={{ color: '#72ff72' }}>⬤</Text> Completado
          </Text>
          <Text style={[styles.referenceText, currentTheme.text]}>
            <Text style={{ color: '#fd5555' }}>⬤</Text> No Completado
          </Text>
          <Text style={[styles.referenceText, currentTheme.text]}>
            <Text style={{ color: '#9d9d9d' }}>⬤</Text> Día de cumplimiento
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
    alignSelf: 'center',
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