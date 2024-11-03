import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { decodeToken } from 'react-jwt';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface DecodedToken {
  email?: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '865233704774-g02ci3hij3cp5sjqlifq1ljn35gbtaso.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      scheme: 'myapp',
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (!id_token) {
        setErrorMessage('No se recibió el id_token.');
        return;
      }

      const decodedToken = decodeToken<DecodedToken>(id_token);
      console.log('Token decodificado:', decodedToken);
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const token = await userCredential.user.getIdToken();
          await AsyncStorage.setItem('userToken', token);
          console.log('Token guardado:', token);
          if (userCredential.user.email) {
            login(userCredential.user.email);
            console.log('Usuario autenticado con Google:', userCredential.user.email);
            router.push('/home');
          } else {
            setErrorMessage('No se pudo obtener el email del usuario.');
          }
        })
        .catch((error) => {
          setErrorMessage(error.message || 'Error inesperado');
        });
    }
  }, [response]);

  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      router.push('/home');
    }
  }, [isAuthenticated, hasRedirected]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage('');

    // Validaciones de entrada
    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (password.length === 0) {
      setErrorMessage('La contraseña no debe estar vacía.');
      return;
    }

    // Mapeo de errores de Firebase
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No hay registro de un usuario con este correo.',
      'auth/invalid-credential': 'El correo o la contraseña son incorrectos.',
      'auth/user-disabled': 'El usuario ha sido deshabilitado.',
      'auth/operation-not-allowed': 'Este método de inicio de sesión no está habilitado.',
    };

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      console.log('Token guardado:', token);
      if (userCredential.user.email) {
        login(userCredential.user.email);
        console.log('Usuario autenticado:', userCredential.user.email);
        router.push('/home');
      } else {
        setErrorMessage('No se pudo obtener el email del usuario.');
      }
    } catch (error: any) {
      const errorCode = error.code;
      setErrorMessage(errorMessages[errorCode] || error.message || 'Error inesperado');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;

        const decodedToken = decodeToken<DecodedToken>(id_token);
        console.log('Token decodificado:', decodedToken);
        const userEmail = decodedToken?.email;

        if (!userEmail) {
          setErrorMessage('No se pudo obtener el correo del token.');
          return;
        }

        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        await login(userEmail);
        console.log('Usuario autenticado con Google:', userEmail);
        router.push('/home');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error al iniciar sesión con Google. Intenta nuevamente.');
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

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

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
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 3,
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
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 3,
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default LoginScreen;