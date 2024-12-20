import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función de validacion de correo
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mapeo de errores de Firebase a mensajes
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
    'auth/invalid-email': 'El correo electrónico ingresado no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  };

  const handleRegister = async () => {
    setErrorMessage(null);

    // Validación correo
    if (!isValidEmail(email)) {
      setErrorMessage('El correo electrónico ingresado no es válido.');
      return;
    }

    // Validación contraseña
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Registro exitoso', `Usuario registrado: ${user.email}`);
      router.push('/login');
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Captura el código de error de Firebase
        const userFriendlyMessage = errorMessages[error.code] || 'Ocurrió un error inesperado.';
        setErrorMessage(userFriendlyMessage);
      } else {
        setErrorMessage('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      
      <Button title="Registrarse" onPress={handleRegister} />
      
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 12,
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;