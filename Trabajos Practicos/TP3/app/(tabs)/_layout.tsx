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
import { Provider as PaperProvider } from 'react-native-paper';
import PrivateRoute from './privateRoute';

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

  return (
    <>
      {isAuthenticated && <Navbar />}
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        
        <Stack.Screen 
          name="home" 
          component={() => <PrivateRoute component={HomeScreen} />} 
        />
        <Stack.Screen 
          name="addHabit" 
          component={() => <PrivateRoute component={AddHabitScreen} />} 
        />
        <Stack.Screen 
          name="detailHabit" 
          component={() => <PrivateRoute component={DetailHabitScreen} />} 
        />
        <Stack.Screen 
          name="listHabit" 
          component={() => <PrivateRoute component={ListHabitScreen} />} 
        />
      </Stack.Navigator>
    </>
  );
}