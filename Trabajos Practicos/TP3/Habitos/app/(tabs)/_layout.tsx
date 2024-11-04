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
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { ThemeProvider, useTheme } from '../../components/ThemeContext';
import { Colors } from '../../constants/Colors';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

export default function AppLayout() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}

function ThemedApp() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? Colors.light : Colors.dark;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <AuthenticatedApp />
      <View style={{ position: 'absolute', top: 40, right: 20 }}>
        <TouchableOpacity onPress={toggleTheme}>
          {/* <Icon
            name={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
            size={24}
            color={theme === 'light' ? '#000' : '#fff'}
          /> */}
        </TouchableOpacity>
      </View>
    </StyledThemeProvider>
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
      {isAuthenticated && <Navbar />}
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="home" component={isAuthenticated ? HomeScreen : LoginScreen} />
        <Stack.Screen name="addHabit" component={isAuthenticated ? AddHabitScreen : LoginScreen} />
        <Stack.Screen name="detailHabit" component={isAuthenticated ? DetailHabitScreen : LoginScreen} />
        <Stack.Screen name="listHabit" component={isAuthenticated ? ListHabitScreen : LoginScreen} />
      </Stack.Navigator>
    </>
  );
}