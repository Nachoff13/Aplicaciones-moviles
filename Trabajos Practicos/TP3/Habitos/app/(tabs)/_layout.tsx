import { Stack } from 'expo-router';
import { AuthProvider } from '../../context/AuthContext';

export default function AppLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="register" />
      </Stack>
    </AuthProvider>
  );
}