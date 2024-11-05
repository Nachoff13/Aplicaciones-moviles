import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles, light, dark } from "../constants/HabitModalStyles";

interface HabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editName: string;
  setEditName: React.Dispatch<React.SetStateAction<string>>;
  editImportance: string;
  setEditImportance: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  editActive: number;
  setEditActive: React.Dispatch<React.SetStateAction<number>>;
  editDays: string;
  setEditDays: React.Dispatch<React.SetStateAction<string>>;
  editStartTime: string; // Formato HH:mm:ss
  setEditStartTime: React.Dispatch<React.SetStateAction<string>>;
  editEndTime: string; // Formato HH:mm:ss
  setEditEndTime: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean; // Nueva prop para el modo oscuro
}

const HabitModal: React.FC<HabitModalProps> = ({ 
  visible, 
  onClose, 
  onSave, 
  editName,
  setEditName, 
  editImportance, 
  setEditImportance, 
  editDescription, 
  setEditDescription, 
  editActive, 
  setEditActive, 
  editDays, 
  setEditDays, 
  editStartTime, 
  setEditStartTime, 
  editEndTime, 
  setEditEndTime,
  isDarkMode
}) => {
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDays(editDays.split(','));
  }, [editDays, visible]);

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) => {
      const newDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];

      setEditDays(newDays.join(','));
      return newDays;
    });
  };

  const handleStartConfirm = (time: Date) => {
    setEditStartTime(time.toTimeString().split(' ')[0].slice(0, 5)); // Formato HH:mm:ss
    setStartTimePickerVisible(false);
  };

  const handleEndConfirm = (time: Date) => {
    setEditEndTime(time.toTimeString().split(' ')[0].slice(0, 5)); // Formato HH:mm:ss
    setEndTimePickerVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={[styles.modalContainer, isDarkMode ? dark.container : light.container]}>
        <Text style={[styles.modalTitle, isDarkMode ? dark.text : light.text]}>Editar Hábito</Text>
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Nombre</Text>
        <TextInput
          style={[styles.input, isDarkMode ? dark.card : light.card]}
          placeholder="Nombre del hábito"
          placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          value={editName}
          onChangeText={setEditName}
        />
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Descripción</Text>
        <TextInput
          style={[styles.input, isDarkMode ? dark.card : light.card]}
          placeholder="Descripción"
          placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          value={editDescription}
          onChangeText={setEditDescription}
        />
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Importancia</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={editImportance}
            onValueChange={(itemValue) => setEditImportance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una importancia" value="" />
            <Picker.Item label="Alta" value="Alta" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Baja" value="Baja" />
          </Picker>
        </View>
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Días</Text>
        <View style={styles.checkboxContainer}>
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
            <CheckBox
              key={day}
              title={day}
              checked={selectedDays.includes(day)}
              onPress={() => toggleDay(day)}
              containerStyle={{ backgroundColor: 'transparent' }}
              textStyle={isDarkMode ? dark.text : light.text}
            />
          ))}
        </View>
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Horario de Inicio</Text>
        <TouchableOpacity onPress={() => setStartTimePickerVisible(true)} style={[styles.timePicker, isDarkMode ? dark.card : light.card]}>
          <Text style={styles.timeText}>{editStartTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartConfirm}
          onCancel={() => setStartTimePickerVisible(false)}
        />
        <Text style={[styles.label, isDarkMode ? dark.text : light.text]}>Horario de Fin</Text>
        <TouchableOpacity onPress={() => setEndTimePickerVisible(true)} style={[styles.timePicker, isDarkMode ? dark.card : light.card]}>
          <Text style={styles.timeText}>{editEndTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndConfirm}
          onCancel={() => setEndTimePickerVisible(false)}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSave}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default HabitModal;