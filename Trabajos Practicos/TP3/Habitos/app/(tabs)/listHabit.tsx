import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

// Define el tipo para los parámetros del stack
type RootStackParamList = {
  detailHabit: { habitId: string };
};

// Define el tipo de navegación
type ListHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'detailHabit'>;

const ListHabitScreen: React.FC = () => {
  const navigation = useNavigation<ListHabitScreenNavigationProp>();
  const [habits, setHabits] = useState<{ id: string; name: string; importance: string }[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync('habits.db');
      setDb(database);
    };

    initDb();
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!db) return;

      try {
        const results = await db.getAllAsync('SELECT * FROM habits');
        const fetchedHabits = results as { id: string; name: string; importance: string }[];
        setHabits(fetchedHabits);
      } catch (error) {
        console.error('Error al obtener los hábitos:', error);
      }
    };

    fetchHabits();
  }, [db]);

  const handlePress = (habitId: string) => {
    navigation.navigate('detailHabit', { habitId });
  };

  const handleDeleteAll = async () => {
    if (db) {
      try {
        await db.execAsync("DELETE FROM habits;");
        setHabits([]);
        Alert.alert('Éxito', 'Todos los hábitos han sido eliminados.');
      } catch (error) {
        console.error('Error al eliminar los hábitos:', error);
        Alert.alert('Error', 'No se pudieron eliminar los hábitos.');
      }
    } else {
      Alert.alert('Error', 'Base de datos no inicializada');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Hábitos</Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAll}>
        <Text style={styles.btnText}>Eliminar todos los hábitos</Text>
      </TouchableOpacity>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.habitContainer}>
            <Text style={styles.subTitle}>{item.name}</Text>
            <Text style={styles.subTitle}>{item.importance}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handlePress(item.id.toString())}>
              <Text style={styles.btnText}>Detalles</Text>
            </TouchableOpacity>
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
    marginBottom: 16,
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

  subTitle: {
    fontSize: 18,
  },

  deleteBtn: {
    backgroundColor: '#ff4d4d',
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
  
});

export default ListHabitScreen;