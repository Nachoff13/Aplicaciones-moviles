import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
      
      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, done INT, value TEXT);"
      );
    };
  
    initializeDatabase();
  }, []);
  


  const handleAddHabit = async () => {
    if (db) {
      try {
        // Ejecutar la inserción directamente en la base de datos
        await db.execAsync(
          `INSERT INTO habits (name, importance) VALUES ('${habitName}', ${habitImportance});`
        );
  
        // Ejecutar una consulta para obtener el último ID insertado
        const result = await db.execAsync('SELECT last_insert_rowid();');
  
        // Acceder al último ID insertado. Asegúrate de que el resultado sea un array.
        const lastInsertId = result[0]?.[0];
  
        console.log('Hábito agregado con ID:', lastInsertId);
        navigation.navigate('HabitDetail', { habitId: lastInsertId });
      } catch (error) {
        console.error('Error al agregar el hábito:', error);
      }
    } else {
      console.error('Base de datos no inicializada');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del hábito"
        value={habitName}
        onChangeText={setHabitName}
      />
      <TextInput
        style={styles.input}
        placeholder="Importancia"
        value={habitImportance}
        onChangeText={setHabitImportance}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
        <Text style={styles.buttonText}>Agregar Hábito</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Para Android
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
    elevation: 5, // Para Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabit;