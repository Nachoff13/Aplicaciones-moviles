import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const HabitModal = ({ visible, onClose, onSave, editName, setEditName, editImportance, setEditImportance }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Editar Hábito</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del hábito"
          value={editName}
          onChangeText={setEditName}
        />
        <TextInput
          style={styles.input}
          placeholder="Importancia (Alta, Media, Baja)"
          value={editImportance}
          onChangeText={setEditImportance}
        />
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
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', width: '40%' },
  cancelButton: { backgroundColor: '#ff4d4d' },
  btnText: { color: '#fff', fontSize: 16 },
});

export default HabitModal;