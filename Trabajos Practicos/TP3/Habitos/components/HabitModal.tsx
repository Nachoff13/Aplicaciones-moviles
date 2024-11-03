import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HabitModal = ({ visible, onClose, onSave, editName, setEditName, editImportance, setEditImportance }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Editar Hábito</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del hábito"
          value={editName}
          onChangeText={setEditName}
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
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onSave}>
            <Text style={styles.btnText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f7f7f7'},
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', width: '40%' },
  cancelButton: { backgroundColor: '#ff4d4d' },
  btnText: { color: '#fff', fontSize: 16 },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%' },
  label: { fontSize: 16, marginBottom: 8 },
});

export default HabitModal;