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

WebBrowser.maybeCompleteAuthSession();

interface DecodedToken {
  email?: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error

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
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          router.push({
            pathname: '/home',
            params: { email: user.email },
          });
        })
        .catch((error) => {
          setErrorMessage(error.message || 'Error inesperado');
        });
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.email) {
        await login(user.email);
        setErrorMessage('');
        router.push('/home');
      } else {
        setErrorMessage('No se pudo obtener el email del usuario.');
      }
    } catch (error: any) {
      // Comprobar el tipo del error para obtener el mensaje
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No hay registro de un usuario con este correo.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('La contraseña es incorrecta.');
      } else if (error.error && error.error.code === 400) {
        const errorMessage = error.error.message || 'Error inesperado';
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(error.message || 'Error inesperado');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;

        const decodedToken = decodeToken<DecodedToken>(id_token);
        const userEmail = decodedToken?.email;

        if (!userEmail) {
          setErrorMessage('No se pudo obtener el correo del token.');
          return;
        }

        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        await login(userEmail);
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
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

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
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default LoginScreen;