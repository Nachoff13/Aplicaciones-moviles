import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Configuración de Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '865233704774-g02ci3hij3cp5sjqlifq1ljn35gbtaso.apps.googleusercontent.com',
    redirectUri: makeRedirectUri(),
  });

  // Maneja la respuesta de Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          Alert.alert('Inicio de sesión exitoso', `Bienvenido ${user.email}`);
          router.push('/home');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Inicio de sesión exitoso', `Bienvenido ${user.email}`);
        router.push('/home');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Error de autenticación', 'Ocurrió un error al iniciar sesión con Google. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
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

      <Button title="Iniciar sesión" onPress={handleLogin} />

      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>¿No tienes una cuenta? Crea una aquí</Text>
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
  },
  googleButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;