import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../../firebaseConfig'; 
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
  AddHabit: undefined;
  HabitDetail: { habitId: number };
};

type AddHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddHabit'>;

const AddHabit = () => {
  const [habitName, setHabitName] = useState<string>('');
  const [habitImportance, setHabitImportance] = useState<string>('');
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('habits.db');
      setDb(database);
      //await database.execAsync("DROP TABLE IF EXISTS habits;");

      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY NOT NULL, name TEXT, importance TEXT, user_id TEXT);"
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
        'INSERT INTO habits (name, importance, user_id) VALUES (?, ?, ?)',
        [habitName, habitImportance, userId]
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
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Hábitos</Text>
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del hábito"
        value={habitName}
        onChangeText={setHabitName}
      />
      
      <Text style={styles.label}>Importancia</Text>
      <View style={styles.pickerContainer}>
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

      <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
        <Text style={styles.buttonText}>Agregar Hábito</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: { 
    padding: 10, 
    borderRadius: 5, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 10, 
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4285f4',
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
});

export default AddHabit;