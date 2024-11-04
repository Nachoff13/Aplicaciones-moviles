import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../../firebaseConfig'; 
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  AddHabit: undefined;
  HabitDetail: { habitId: number };
};

type AddHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddHabit'>;

const AddHabit = () => {
  const [habitName, setHabitName] = useState<string>('');
  const [habitImportance, setHabitImportance] = useState<string>('');
  const [habitDescription, setHabitDescription] = useState<string>('');
  const [habitActive, setHabitActive] = useState<number>(1);
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? styles.light : styles.dark;
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('habits.db');
      setDb(database);
      //await database.execAsync("DROP TABLE IF EXISTS habits;");

      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY NOT NULL, name TEXT, importance TEXT, description TEXT, active INTEGER DEFAULT 1, user_id TEXT);"
      );
    };

    initializeDatabase();
  }, []);

  const handleAddHabit = async () => {
    if (!db) {
      Alert.alert('Error', 'Base de datos no inicializada');
      return;
    }

    if (!habitName || !habitImportance) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Obtengo el UID del usuario autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No se encontró el usuario autenticado');
      return;
    }
    const userId = currentUser.uid;

    try {
      const result = await db.runAsync(
        'INSERT INTO habits (name, importance, description, active, user_id) VALUES (?, ?, ?, ?, ?)',
        [habitName, habitImportance, habitDescription, habitActive, userId]
      );

      
      if (result.lastInsertRowId) {
        Alert.alert('Éxito', `Hábito agregado con éxito.`);
        db.closeAsync();
      } else {
        Alert.alert('Error', 'Error al agregar hábito.');
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error desconocido';
      Alert.alert('Error', `Error al agregar el hábito: ${errorMessage}`);
    }
  };

  return (
    <View style={[styles.container, currentTheme.container]}>
      <Text style={[styles.title, currentTheme.text]}>Agregar Hábitos</Text>
      
      <Text style={[styles.label, currentTheme.text]}>Nombre</Text>
      <TextInput
        style={[styles.input, currentTheme.input]}
        placeholder="Nombre del hábito"
        value={habitName}
        onChangeText={setHabitName}
      />
      
      <Text style={[styles.label, currentTheme.text]}>Importancia</Text>
      <View style={[styles.pickerContainer, currentTheme.input]}>
        <Picker
          selectedValue={habitImportance}
          onValueChange={(itemValue) => setHabitImportance(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una importancia" value="" />
          <Picker.Item label="Baja" value="Baja" />
          <Picker.Item label="Media" value="Media" />
          <Picker.Item label="Alta" value="Alta" />
        </Picker>
      </View>

      <Text style={[styles.label, currentTheme.text]}>Descripción</Text>
      <TextInput
        style={[styles.input, currentTheme.input]}
        placeholder="Descripción"
        value={habitDescription}
        onChangeText={setHabitDescription}
      />

      <TouchableOpacity style={[styles.button, currentTheme.button]} onPress={handleAddHabit}>
        <Text style={styles.buttonText}>Agregar Hábito</Text>
      </TouchableOpacity>

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
    input: { backgroundColor: '#fff', borderColor: '#ddd' },
    button: { backgroundColor: '#4285f4' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    input: { backgroundColor: '#333', borderColor: '#555' },
    button: { backgroundColor: '#4285f4' },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: { 
    padding: 10, 
    borderRadius: 5, 
    borderWidth: 1, 
    marginBottom: 10, 
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default AddHabit;