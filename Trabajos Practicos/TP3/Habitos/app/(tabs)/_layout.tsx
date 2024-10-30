import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="register" />
    </Stack>
  );
}