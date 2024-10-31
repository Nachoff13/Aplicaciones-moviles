import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
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
  const { login } = useAuth(); // Obtiene la función de inicio de sesión desde el contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '865233704774-g02ci3hij3cp5sjqlifq1ljn35gbtaso.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      scheme: 'myapp',
    }),
  });

  // Maneja la respuesta de Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (!id_token) {
        Alert.alert('Error', 'No se recibió el id_token.');
        return;
      }

      const decodedToken = decodeToken<DecodedToken>(id_token);

      const credential = GoogleAuthProvider.credential(id_token);

      // Iniciar sesion con Firebase
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          // Redirige a la pantalla de inicio con el nombre y email
          router.push({
            pathname: '/home',
            params: {email: user.email },
          });
        })
        .catch((error: Error) => {
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      await login(email);
      Alert.alert('Inicio de sesión exitoso', `Bienvenido ${email}`);
      router.push('/home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
  
        const decodedToken = decodeToken<DecodedToken>(id_token);
        const userEmail = decodedToken?.email ?? "sin correo";
  
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
  
        await login(userEmail); // Guarda el nombre y el correo en el contexto
        router.push('/home');
      }
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