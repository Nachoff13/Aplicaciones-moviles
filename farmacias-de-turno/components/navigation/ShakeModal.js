import React, { useState } from 'react';
import {
  View,
  Modal,
  Button,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useNavigation } from '@react-navigation/native';

export default function ShakeModal({ visible, onClose }) {
  let colorScheme = useColorScheme();

  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handlePasswordSubmit = () => {
    if (password === '123456') {
      console.log('Contraseña correcta');
      onClose();
      navigation.navigate('admin');
    } else {
      alert('Contraseña incorrecta');
    }
    setPassword('');
  };

  const handleOnClose = () => {
    onClose();
    setPassword('');
  };

  return (
    <ThemedView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView
            style={
              (colorScheme === 'light' && styles.modalViewLight) ||
              (colorScheme === 'dark' && styles.modalViewDark)
            }
          >
            <ThemedText style={styles.modalText}>
              Ingrese la contraseña del administrador
            </ThemedText>
            <TextInput
              style={
                (colorScheme === 'light' && styles.inputLightView) ||
                (colorScheme === 'dark' && styles.inputDarkView)
              }
              placeholder="Contraseña"
              placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <ThemedView style={styles.buttonContainer}>
              <Button onPress={handleOnClose} title="Cerrar" />
              <Button onPress={handlePasswordSubmit} title="Enviar" />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalViewLight: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewDark: {
    margin: 20,
    backgroundColor: '#151718',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputLightView: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000',
  },
  inputDarkView: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
