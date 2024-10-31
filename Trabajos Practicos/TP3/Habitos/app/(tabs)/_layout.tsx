import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navigation/Navbar';

export default function AppLayout() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { email } = useAuth();

  return (
    <>
      {/* Muestra el Navbar solo si el usuario está autenticado */}
      {email && <Navbar />}
      
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}