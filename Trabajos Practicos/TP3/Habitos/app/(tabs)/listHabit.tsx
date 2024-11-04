import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  detailHabit: { habitId: string };
};

type ListHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'detailHabit'>;

const ListHabitScreen: React.FC = () => {
  const navigation = useNavigation<ListHabitScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? styles.light : styles.dark;
  const [habits, setHabits] = useState<{
    id: string;
    name: string;
    importance: string;
    description: string;
    active: number;
    days: string;
    start_time: string;
    end_time: string;
  }[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  const currentUser = auth.currentUser;
  if (!currentUser) {
    Alert.alert("Error", "No se encontró el usuario autenticado");
    return null;

  }
  const userId = currentUser.uid;

  useEffect(() => {
    const initDb = async () => {
      if (Platform.OS !== 'web') {
        const database = await SQLite.openDatabaseAsync("habits.db");
        setDb(database);
        fetchHabits(database);
      }
    };

    initDb();
  }, []);

  const fetchHabits = async (database: SQLite.SQLiteDatabase) => {
    if (!userId) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    try {
      const results = await database.getAllAsync(
        "SELECT * FROM habits WHERE user_id = ?",
        [userId]
      );
      const fetchedHabits = results as {
        id: string;
        name: string;
        importance: string;
        description: string;
        active: number;
        days: string;
        start_time: string;
        end_time: string;
      }[];

      const today = new Date();
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const todayName = dayNames[today.getDay()];

      // Filtra habitos que contengan el dia actual
      const filteredHabits = fetchedHabits.filter(habit => habit.days.includes(todayName));

      // Ordena los hábitos por hora de inicio
      const sortedHabits = filteredHabits.sort((a, b) => {
        const [aHours, aMinutes] = a.start_time.split(':').map(Number);
        const [bHours, bMinutes] = b.start_time.split(':').map(Number);
        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
      });

      if (sortedHabits.length === 0) {
        Alert.alert("No se encontraron hábitos para hoy.");
      } else {
        setHabits(sortedHabits);
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Ocurrió un error inesperado";
      Alert.alert("Error al obtener los hábitos", errorMessage);
    }
  };

  const handlePress = (habitId: string) => {
    navigation.navigate("detailHabit", { habitId });
  };

  const handleDeleteAll = async () => {
    if (db) {
      try {
        await db.execAsync("DELETE FROM habits;");
        setHabits([]);
        Alert.alert("Éxito", "Todos los hábitos han sido eliminados.");
      } catch (error) {
        console.error("Error al eliminar los hábitos:", error);
        Alert.alert("Error", "No se pudieron eliminar los hábitos.");
      }
    } else {
      Alert.alert("Error", "Base de datos no inicializada");
    }
  };

  return (
    <View style={[styles.container, currentTheme.container]}>
      <Text style={[styles.title, currentTheme.text]}>Lista de Hábitos Activos</Text>
      <TouchableOpacity style={[styles.deleteBtn, currentTheme.button]} onPress={handleDeleteAll}>
        <Text style={styles.btnText}>Eliminar todos los hábitos</Text>
      </TouchableOpacity>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.id)}>
            <View style={[styles.habitContainer, currentTheme.habitContainer]}>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.text]}>Nombre: </Text>
                <Text style={[styles.content, currentTheme.text]}>{item.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.text]}>Importancia: </Text>
                <Text style={[styles.content, currentTheme.text]}>{item.importance}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.text]}>Descripción: </Text>
                <Text style={[styles.content, currentTheme.text]}>{item.description}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.subTitle}>Días: </Text>
                <Text style={styles.content}>{item.days}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.subTitle}>Horario de Inicio: </Text>
                <Text style={styles.content}>{item.start_time}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.subTitle}>Horario de Fin: </Text>
                <Text style={styles.content}>{item.end_time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon
            name={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
            size={24}
            color={theme === 'light' ? '#000' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  light: {
    container: { backgroundColor: '#f7f7f7' },
    text: { color: '#000' },
    habitContainer: { backgroundColor: '#fff' },
    button: { backgroundColor: '#ff4d4d' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    habitContainer: { backgroundColor: '#333' },
    button: { backgroundColor: '#ff4d4d' },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  habitContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' },
  subTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { fontSize: 16, marginLeft: 0 },
  deleteBtn: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default ListHabitScreen;