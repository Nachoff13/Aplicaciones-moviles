import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  Modal,
  Button,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { auth } from "../../firebaseConfig";
import { CheckBox } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from "../../components/ThemeContext";
import { styles, light, dark } from "../../constants/AddHabitStyles";


type RootStackParamList = {
  AddHabit: undefined;
  HabitDetail: { habitId: number };
};

type AddHabitScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddHabit"
>;

const AddHabit = () => {
  const [habitName, setHabitName] = useState<string>("");
  const [habitImportance, setHabitImportance] = useState<string>("");
  const [habitDescription, setHabitDescription] = useState<string>("");
  const [habitActive, setHabitActive] = useState(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? light : dark;
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      if (Platform.OS !== 'web') {
        const database = await SQLite.openDatabaseAsync('habits.db');
        setDb(database);
        //await database.execAsync("DROP TABLE IF EXISTS habits;");
        await database.execAsync(
          `CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
            importance TEXT,
            description TEXT,
            active INTEGER DEFAULT 0,
            user_id TEXT,
            days TEXT,
            start_time TEXT,
            end_time TEXT
          );`
        );
        await database.execAsync(
          `CREATE TABLE IF NOT EXISTS habit_progress (
            id INTEGER PRIMARY KEY NOT NULL,
            habit_id INTEGER,
            date TEXT,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
          );`
        );
      }
    };
  
  
    initializeDatabase();
  }, []);

  const handleAddHabit = async () => {
    if (!db) {
      Alert.alert("Error", "Base de datos no inicializada");
      return;
    }

    if (!habitName || !habitImportance) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "No se encontró el usuario autenticado");
      return;
    }
    const userId = currentUser.uid;

    try {
      const result = await db.runAsync(
        "INSERT INTO habits (name, importance, description, active, user_id, days, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          habitName,
          habitImportance,
          habitDescription,
          habitActive,
          userId,
          selectedDays.join(","),
          startTime.toTimeString().split(" ")[0].slice(0, 5), // Formato "HH:mm"
          endTime.toTimeString().split(" ")[0].slice(0, 5),
        ]
      );

      if (result.lastInsertRowId) {
        Alert.alert("Éxito", `Hábito agregado con éxito.`);
        db.closeAsync();
      } else {
        Alert.alert("Error", "Error al agregar hábito.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Error desconocido";
      Alert.alert("Error", `Error al agregar el hábito: ${errorMessage}`);
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
    <ScrollView style={[styles.container, currentTheme.container]}>
      <Text style={[styles.title, currentTheme.text]}>Agregar Hábitos</Text>

      <Text style={[styles.label, currentTheme.text]}>Nombre</Text>
      <TextInput
        style={[styles.input, currentTheme.input]}
        placeholder="Nombre del hábito"
        placeholderTextColor={theme === "light" ? "#000" : "#aaa"}
        value={habitName}
        onChangeText={setHabitName}
      />

      <Text style={[styles.label, currentTheme.text]}>Importancia</Text>
      {Platform.OS === "ios" ? (
        <>
          <TouchableOpacity onPress={() => setPickerVisible(true)}>
            <Text style={[styles.input, currentTheme.input]}>
              {habitImportance || "Seleccione una importancia"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={isPickerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.pickerContaineriOS, currentTheme.input]}>
                <Picker
                  selectedValue={habitImportance}
                  onValueChange={(itemValue) => {
                    setHabitImportance(itemValue);
                  }}
                  style={{ color: theme === "light" ? "#000" : "#aaa" }} // Ajustar el color del texto del Picker
                  dropdownIconColor={theme === "light" ? "#000" : "#aaa"} // Ajustar el color del icono del dropdown
                >
                  <Picker.Item label="Seleccione una importancia" value="" />
                  <Picker.Item label="Baja" value="Baja" />
                  <Picker.Item label="Media" value="Media" />
                  <Picker.Item label="Alta" value="Alta" />
                </Picker>
                <Button title="Guardar" onPress={() => setPickerVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View
          style={[
            styles.pickerContainerAndroid,
            { backgroundColor: theme === "light" ? "#fff" : "#333" },
          ]}
        >
          <Picker
            selectedValue={habitImportance}
            onValueChange={(itemValue) => setHabitImportance(itemValue)}
            style={{ color: theme === "light" ? "#000" : "#aaa" }} // Ajustar el color del texto del Picker
            dropdownIconColor={theme === "light" ? "#000" : "#aaa"} // Ajustar el color del icono del dropdown
          >
            <Picker.Item label="Seleccione una importancia" value="" />
            <Picker.Item label="Baja" value="Baja" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Alta" value="Alta" />
          </Picker>
        </View>
      )}

      <Text style={[styles.label, currentTheme.text]}>Descripción</Text>
      <TextInput
        style={[styles.input, currentTheme.input]}
        placeholder="Descripción"
        placeholderTextColor={theme === "light" ? "#000" : "#aaa"}
        value={habitDescription}
        onChangeText={setHabitDescription}
      />

      <Text style={[styles.label, currentTheme.text]}>Días de la semana</Text>
      {[
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ].map((day) => (
        <CheckBox
          key={day}
          title={day}
          checked={selectedDays.includes(day)}
          onPress={() => toggleDay(day)}
          containerStyle={currentTheme.checkboxContainer}
          textStyle={currentTheme.text}
        />
      ))}

      <Text style={[styles.label, currentTheme.text]}>Horario de Inicio</Text>
      <TouchableOpacity
        style={[styles.buttonHour, currentTheme.input]}
        onPress={() => setStartPickerVisible(true)}
      >
        <Text style={[styles.buttonTextHour, currentTheme.text]}>
          {startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={handleStartConfirm}
        onCancel={() => setStartPickerVisible(false)}
      />

      <Text style={[styles.label, currentTheme.text]}>Horario de Fin</Text>
      <TouchableOpacity
        style={[styles.buttonHour, currentTheme.input]}
        onPress={() => setEndPickerVisible(true)}
      >
        <Text style={[styles.buttonTextHour, currentTheme.text]}>
          {endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={handleEndConfirm}
        onCancel={() => setEndPickerVisible(false)}
      />

      <TouchableOpacity
        style={[styles.button, currentTheme.button]}
        onPress={handleAddHabit}
      >
        <Text style={styles.buttonText}>Agregar Hábito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddHabit;