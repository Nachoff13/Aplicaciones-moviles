import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../../firebaseConfig';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

type RootStackParamList = {
  AddHabit: undefined;
  HabitDetail: { habitId: number };
};

type AddHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddHabit'>;

const AddHabit = () => {
  const [habitName, setHabitName] = useState('');
  const [habitImportance, setHabitImportance] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitActive, setHabitActive] = useState(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('habits.db');
      setDb(database);
      //await database.execAsync("DROP TABLE IF EXISTS habits;");

      await database.execAsync(
        "CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY NOT NULL, name TEXT, importance TEXT, description TEXT, active INTEGER DEFAULT 1, user_id TEXT, days TEXT, start_time TEXT, end_time TEXT);"
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

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No se encontró el usuario autenticado');
      return;
    }
    const userId = currentUser.uid;

    try {
      const result = await db.runAsync(
        'INSERT INTO habits (name, importance, description, active, user_id, days, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          habitName,
          habitImportance,
          habitDescription,
          habitActive,
          userId,
          selectedDays.join(','),
          startTime.toTimeString().split(' ')[0].slice(0, 5), // Formato "HH:mm"
          endTime.toTimeString().split(' ')[0].slice(0, 5),
        ]
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

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleStartConfirm = (time: Date) => {
    setStartTime(time);
    setStartPickerVisible(false);
  };

  const handleEndConfirm = (time: Date) => {
    setEndTime(time);
    setEndPickerVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Hábitos</Text>
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del hábito"
        value={habitName}
        onChangeText={setHabitName}
      />
      
      <Text style={styles.label}>Importancia</Text>
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

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={habitDescription}
        onChangeText={setHabitDescription}
      />

      <Text style={styles.label}>Días de la semana</Text>
      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
        <CheckBox
          key={day}
          title={day}
          checked={selectedDays.includes(day)}
          onPress={() => toggleDay(day)}
        />
      ))}

      <Text style={styles.label}>Horario de Inicio</Text>
      <TouchableOpacity style={styles.buttonHour} onPress={() => setStartPickerVisible(true)}>
        <Text style={styles.buttonTextHour}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={handleStartConfirm}
        onCancel={() => setStartPickerVisible(false)}
      />

      <Text style={styles.label}>Horario de Fin</Text>
      <TouchableOpacity style={styles.buttonHour} onPress={() => setEndPickerVisible(true)}>
        <Text style={styles.buttonTextHour}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={handleEndConfirm}
        onCancel={() => setEndPickerVisible(false)}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
        <Text style={styles.buttonText}>Agregar Hábito</Text>
      </TouchableOpacity>
    </ScrollView>
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
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
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
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonHour: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderColor: '#C3C3C3',
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonTextHour: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AddHabit;