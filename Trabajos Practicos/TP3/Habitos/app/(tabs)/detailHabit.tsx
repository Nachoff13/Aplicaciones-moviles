import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import HabitList from '../../components/HabitList';
import HabitModal from '../../components/HabitModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SearchBar from '../../components/SearchBar';
import { useTheme } from '../../components/ThemeContext';
import { styles, light, dark } from '../../constants/DetailHabitStyles';

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
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? light : dark;
  const [isDark, setIsDark] = useState(theme === "dark");
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

  // Nuevos estados para el modal de confirmación
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

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

  const handleDeleteHabit = (id: string) => {
    setHabitToDelete(id); // Almacena el ID del hábito a eliminar
    setIsConfirmDeleteVisible(true); // Muestra el modal de confirmación
  };

  // Función que se ejecuta al confirmar la eliminación de un hábito
  const confirmDelete = async () => {
    if (habitToDelete) {
      if (db) {
        try {
          await db.runAsync('DELETE FROM habits WHERE id = :id', { ':id': habitToDelete });
          setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitToDelete));
          setFilteredHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitToDelete));
          Alert.alert('Éxito', 'Hábito eliminado exitosamente.');
        } catch (error) {
          console.error('Error al eliminar el hábito:', error);
          Alert.alert('Error', 'No se pudo eliminar el hábito.');
        }
      }
    }
    setHabitToDelete(null); // Reinicia la variable después de confirmar
    setIsConfirmDeleteVisible(false); // Cierra el modal
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

  const handleDeleteAll = () => {
    setIsConfirmDeleteVisible(true); // Muestra el modal de confirmación
  };

  // Función que se ejecuta al confirmar la eliminación de todos los hábitos
  const confirmDeleteAll = async () => {
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
    setIsConfirmDeleteVisible(false); // Cierra el modal
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
      <SearchBar
        searchText={searchText}
        onSearch={handleSearch}
        inputStyle={[styles.searchInput, currentTheme.searchInput]}
        placeholderTextColor={theme === 'light' ? '#000' : '#fff'}
      />
      <TouchableOpacity style={[styles.deleteBtn, currentTheme.button]} onPress={handleDeleteAll}>
        <Text style={styles.btnText}>Eliminar todos los hábitos</Text>
      </TouchableOpacity>
      <HabitList isDarkMode={isDark} habits={filteredHabits} onEdit={handleEditHabit} onDelete={handleDeleteHabit} />
      <HabitModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveEdit}
        isDarkMode={isDark}

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

      <ConfirmDeleteModal
        visible={isConfirmDeleteVisible}
        onConfirm={habitToDelete ? confirmDelete : confirmDeleteAll}
        onCancel={() => {
          setIsConfirmDeleteVisible(false);
          setHabitToDelete(null); // Reinicia la variable
        }}
      />
    </View>
  );
};

export default DetailHabitScreen;