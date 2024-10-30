import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registro exitoso
        const user = userCredential.user;
        Alert.alert('Registro exitoso', `Usuario registrado: ${user.email}`);
        
        // Redirige a la pantalla de inicio de sesion
        router.push('/login');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
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
});

export default RegisterScreen;