import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

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
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY NOT NULL, name TEXT, importance TEXT);"
      );
    };
  
    initializeDatabase();
  }, []);
  


  const handleAddHabit = async () => {
    if (db) {
      try {
        const query = `
          INSERT INTO habits (name, importance) VALUES ('${habitName}', '${habitImportance}');
        `;
  
        await db.execAsync(query);
  
        // obtener el último ID insertado
        const result = await db.execAsync('SELECT last_insert_rowid();');
  
        const lastInsertId = result[0]?.rows?._array[0]?.['last_insert_rowid()'];
  
        if (lastInsertId !== undefined) {
          Alert.alert('Éxito', `Hábito agregado con ID: ${lastInsertId}`);
          navigation.navigate('HabitDetail', { habitId: lastInsertId });
        } else {
          Alert.alert('Error', 'No se pudo obtener el último ID insertado.');
        }
    } catch (error: any) {
        Alert.alert('Error', `Error al agregar el hábito: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Base de datos no inicializada');
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
    elevation: 3,
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