import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navigation/Navbar';
import LoginScreen from './login';
import HomeScreen from './home';
import RegisterScreen from './register';
import AddHabitScreen from './addHabit';
import DetailHabitScreen from './detailHabit';
import ListHabitScreen from './listHabit';

const Stack = createStackNavigator();

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
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="addHabit" component={AddHabitScreen} />
        <Stack.Screen name="detailHabit" component={DetailHabitScreen} />
        <Stack.Screen name="listHabit" component={ListHabitScreen} />
      </Stack.Navigator>
    </>
  );
}