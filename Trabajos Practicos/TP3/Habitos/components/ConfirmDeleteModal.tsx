import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ConfirmDeleteModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Confirmar eliminación</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d9534f', // Rojo
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#5cb85c', // Verde
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ConfirmDeleteModal;