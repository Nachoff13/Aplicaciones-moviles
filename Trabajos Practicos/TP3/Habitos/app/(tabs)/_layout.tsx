import React, {useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navigation/Navbar';
import LoginScreen from './login';
import HomeScreen from './home';
import RegisterScreen from './register';
import AddHabitScreen from './addHabit';
import DetailHabitScreen from './detailHabit';
import ListHabitScreen from './listHabit';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator();

export default function AppLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </PaperProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    console.log('El estado de autenticación ha cambiado:', isAuthenticated);
    // Aquí puedes agregar cualquier lógica adicional que necesites cuando el estado de autenticación cambie
  }, [isAuthenticated]);
  return (
    <>
      {/* Muestra el Navbar solo si el usuario está autenticado */}
      {isAuthenticated && <Navbar />}
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />

        {/* Rutas protegidas */}
        <Stack.Screen
          name="home"
          component={isAuthenticated ? HomeScreen : LoginScreen}
        />
        <Stack.Screen
          name="addHabit"
          component={isAuthenticated ? AddHabitScreen : LoginScreen}
        />
        <Stack.Screen
          name="detailHabit"
          component={isAuthenticated ? DetailHabitScreen : LoginScreen}
        />
        <Stack.Screen
          name="listHabit"
          component={isAuthenticated ? ListHabitScreen : LoginScreen}
        />
      </Stack.Navigator>
    </>
  );
}