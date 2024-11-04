import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import HabitList from '../../components/HabitList';
import HabitModal from '../../components/HabitModal';
import SearchBar from '../../components/SearchBar';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  detailHabit: { habitId: string };
};

type Habit = {
  id: string;
  name: string;
  importance: string;
  description: string;
  active: number;
  days: string;
  start_time: string;
  end_time: string;
};

const DetailHabitScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'detailHabit'>>();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? styles.light : styles.dark;
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [searchText, setSearchText] = useState('');
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImportance, setEditImportance] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editActive, setEditActive] = useState(1);
  const [editDays, setEditDays] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  useEffect(() => {
    const initDb = async () => {
      if (Platform.OS !== 'web') {
        const database = await SQLite.openDatabaseAsync("habits.db");
        setDb(database);
      }
    };

    initDb();
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!db) return;

      try {
        const results: unknown = await db.getAllAsync('SELECT * FROM habits');
        const fetchedHabits: Habit[] = results as Habit[];

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
    setEditDescription(habit.description);
    setEditActive(habit.active);
    setEditDays(habit.days);
    setEditStartTime(habit.start_time);
    setEditEndTime(habit.end_time);
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
          'UPDATE habits SET name = :name, importance = :importance, description = :description, active = :active, days = :days, start_time = :start_time, end_time = :end_time WHERE id = :id',
          {
            ':name': editName,
            ':importance': editImportance,
            ':description': editDescription,
            ':active': editActive,
            ':days': editDays,
            ':start_time': editStartTime,
            ':end_time': editEndTime,
            ':id': selectedHabit.id
          }
        );
        setHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === selectedHabit.id
              ? { ...habit, name: editName, importance: editImportance, description: editDescription, active: editActive, days: editDays, start_time: editStartTime, end_time: editEndTime }
              : habit
          )
        );

        setFilteredHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === selectedHabit.id
              ? { ...habit, name: editName, importance: editImportance, description: editDescription, active: editActive, days: editDays, start_time: editStartTime, end_time: editEndTime }
              : habit
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
    <View style={[styles.container, currentTheme.container]}>
      <Text style={[styles.title, currentTheme.text]}>Detalles de Hábitos</Text>
      <SearchBar searchText={searchText} onSearch={handleSearch} />
      <TouchableOpacity style={[styles.deleteBtn, currentTheme.button]} onPress={handleDeleteAll}>
        <Text style={styles.btnText}>Eliminar todos los hábitos</Text>
      </TouchableOpacity>
      <HabitList habits={filteredHabits} onEdit={handleEditHabit} onDelete={handleDeleteHabit} />
      <HabitModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveEdit}

        editName={editName}
        setEditName={setEditName}

        editImportance={editImportance}
        setEditImportance={setEditImportance}

        editDescription={editDescription}
        setEditDescription={setEditDescription}
        
        editActive={editActive}
        setEditActive={setEditActive}
        editDays={editDays}
        setEditDays={setEditDays}

        editStartTime={editStartTime}
        setEditStartTime={setEditStartTime}

        editEndTime={editEndTime}
        setEditEndTime={setEditEndTime}
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
  container: { flex: 1, padding: 16 },
  light: {
    container: { backgroundColor: '#fff' },
    text: { color: '#000' },
    button: { backgroundColor: '#ff4d4d' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    button: { backgroundColor: '#ff4d4d' },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  habitContainer: { marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  subTitle: { fontSize: 18 },
  deleteBtn: { padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10, width: '90%', alignSelf: 'center' },
  btnText: { color: '#fff', fontSize: 16 },
  searchInput: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, width: '90%', alignSelf: 'center' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', width: '40%' },
  cancelButton: { backgroundColor: '#ff4d4d' },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default DetailHabitScreen;