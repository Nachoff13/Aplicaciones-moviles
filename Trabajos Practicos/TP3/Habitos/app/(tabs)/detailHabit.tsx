import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  detailHabit: { habitId: string };
};

type Habit = {
  id: string;
  name: string;
  importance: string;
};

const DetailHabitScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'detailHabit'>>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [searchText, setSearchText] = useState('');
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImportance, setEditImportance] = useState('');

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
        const results: unknown = await db.getAllAsync('SELECT * FROM habits');
        const fetchedHabits: Habit[] = results as Habit[]; // Casting manual

        setHabits(fetchedHabits);
        setFilteredHabits(fetchedHabits);
      } catch (error) {
        console.error('Error al obtener los hábitos:', error);
      }
    };

    fetchHabits();
  }, [db]);

  const handlePress = (habitId: string) => {
    navigation.navigate('detailHabit', { habitId });
  };

  const handleDeleteHabit = async (id: string) => {
    if (db) {
      try {
        await db.runAsync('DELETE FROM habits WHERE id = :id', { ':id': id });
        setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
        setFilteredHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
        Alert.alert('Éxito', 'Hábito eliminado exitosamente.');
      } catch (error) {
        console.error('Error al eliminar el hábito:', error);
        Alert.alert('Error', 'No se pudo eliminar el hábito.');
      }
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditName(habit.name);
    setEditImportance(habit.importance);
    setIsModalVisible(true);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = habits.filter((habit) =>
        habit.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredHabits(filtered);
    } else {
      setFilteredHabits(habits);
    }
  };

  const handleDeleteAll = async () => {
    if (db) {
      try {
        await db.runAsync('DELETE FROM habits', {});
        setHabits([]);
        setFilteredHabits([]);
        Alert.alert('Éxito', 'Todos los hábitos han sido eliminados.');
      } catch (error) {
        console.error('Error al eliminar todos los hábitos:', error);
        Alert.alert('Error', 'No se pudieron eliminar los hábitos.');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (db && selectedHabit) {
      try {
        await db.runAsync(
          'UPDATE habits SET name = :name, importance = :importance WHERE id = :id',
          { ':name': editName, ':importance': editImportance, ':id': selectedHabit.id }
        );
        setHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === selectedHabit.id ? { ...habit, name: editName, importance: editImportance } : habit
          )
        );
        setFilteredHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === selectedHabit.id ? { ...habit, name: editName, importance: editImportance } : habit
          )
        );
        Alert.alert('Éxito', 'Hábito editado exitosamente.');
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error al editar el hábito:', error);
        Alert.alert('Error', 'No se pudo editar el hábito.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de Hábitos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar hábito"
        value={searchText}
        onChangeText={handleSearch}
      />
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAll}>
        <Text style={styles.btnText}>Eliminar todos los hábitos</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.habitContainer}>
            <Text style={styles.subTitle}>{item.name}</Text>
            <Text style={styles.subTitle}>Importancia: {item.importance}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => handleEditHabit(item)}>
                <FontAwesome name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteHabit(item.id)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Hábito</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del hábito"
            value={editName}
            onChangeText={setEditName}
          />
          <TextInput
            style={styles.input}
            placeholder="Importancia (Alta, Media, Baja)"
            value={editImportance}
            onChangeText={setEditImportance}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
              <Text style={styles.btnText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  habitContainer: { marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  subTitle: { fontSize: 18 },
  deleteBtn: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10, width: '90%', alignSelf: 'center' },
  btnText: { color: '#fff', fontSize: 16 },
  searchInput: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, width: '90%', alignSelf: 'center' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', width: '40%' },
  cancelButton: { backgroundColor: '#ff4d4d' },
});

export default DetailHabitScreen;
