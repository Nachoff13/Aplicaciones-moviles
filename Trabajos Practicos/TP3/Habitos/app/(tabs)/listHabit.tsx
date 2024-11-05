import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native-paper';
import styles from '../../constants/ListHabitStyles'; // Importar los estilos

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
      const errorMessage = (error as Error).message || "Ocurrió un error inesperado";
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

  const handleCompleteHabit = async (habitId: string, currentActive: number) => {
    if (!db) {
      Alert.alert("Error", "Base de datos no inicializada");
      return;
    }
    
    // Cambia el estado del switch inmediatamente
    const newActiveState = currentActive === 1 ? 0 : 1;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, active: newActiveState } : habit
      )
    );

    try {
      await db.runAsync(
        'UPDATE habits SET active = :active WHERE id = :id',
        {
          ':active': newActiveState,
          ':id': habitId,
        }
      );
      //Alert.alert("Éxito", `Hábito marcado como ${newActiveState === 0 ? "no completado" : "completado"}.`);
    } catch (error) {
      console.error("Error al actualizar el estado del hábito:", error);
      // Si hay un error, revertimos el cambio
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId ? { ...habit, active: currentActive } : habit
        )
      );
      Alert.alert("Error", "No se pudo actualizar el estado del hábito.");
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
                <Text style={[styles.subTitle, currentTheme.subTitle]}>Días: </Text>
                <Text style={[styles.content, currentTheme.content]}>{item.days}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.subTitle]}>Horario de Inicio: </Text>
                <Text style={[styles.content, currentTheme.content]}>{item.start_time}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.subTitle]}>Horario de Fin: </Text>
                <Text style={[styles.content, currentTheme.content]}>{item.end_time}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.subTitle, currentTheme.subTitle]}>Completado: </Text>
                <Switch
                  value={item.active === 1} // Estado activo o completado
                  onValueChange={() => handleCompleteHabit(item.id, item.active)}
                  color="#4CAF50"
                />
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

export default ListHabitScreen;