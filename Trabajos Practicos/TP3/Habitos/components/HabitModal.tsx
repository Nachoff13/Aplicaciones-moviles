import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
  setEditEndTime 
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
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Editar Hábito</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del hábito"
          value={editName}
          onChangeText={setEditName}
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={editDescription}
          onChangeText={setEditDescription}
        />
        <Text style={styles.label}>Importancia</Text>
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
        <Text style={styles.label}>Días</Text>
        <View style={styles.checkboxContainer}>
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
            <CheckBox
              key={day}
              title={day}
              checked={selectedDays.includes(day)}
              onPress={() => toggleDay(day)}
            />
          ))}
        </View>
        <Text style={styles.label}>Horario de Inicio</Text>
        <TouchableOpacity onPress={() => setStartTimePickerVisible(true)} style={styles.timePicker}>
          <Text style={styles.timeText}>{editStartTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartConfirm}
          onCancel={() => setStartTimePickerVisible(false)}
        />
        <Text style={styles.label}>Horario de Fin</Text>
        <TouchableOpacity onPress={() => setEndTimePickerVisible(true)} style={styles.timePicker}>
          <Text style={styles.timeText}>{editEndTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndConfirm}
          onCancel={() => setEndTimePickerVisible(false)}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onSave}>
            <Text style={styles.btnText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
  input: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  picker: { height: 50, width: '100%' },
  checkboxContainer: { marginBottom: 15 },
  timePicker: { backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderColor: '#C3C3C3',
    borderWidth: 1,
    marginBottom: 15,},
  timeText: { fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16 },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  btnText: { color: '#fff', fontSize: 16 },
  cancelButton: { backgroundColor: '#ff4d4d' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30},
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', width: '40%' },
  closeButton: { marginTop: 10, alignItems: 'center' },
  closeButtonText: { fontSize: 16, color: 'red' },
});

export default HabitModal;