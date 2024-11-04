import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define los tipos de navegación directamente en este archivo
type RootStackParamList = {
  login: undefined;
  home: undefined;
  register: undefined;
  addHabit: undefined;
  detailHabit: undefined;
  listHabit: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'home'>;

const HomeScreen: React.FC = () => {
  const { email } = useAuth(); // Obtiene los valores del contexto
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? styles.light : styles.dark;

  return (
    <View style={[styles.container, currentTheme.container]}>
      <Text style={[styles.welcomeText, currentTheme.text]}>
        Bienvenido {email}!
      </Text>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity style={[styles.card, currentTheme.card]} onPress={() => navigation.navigate('addHabit')}>
          <Text style={[styles.cardText, currentTheme.text]}>Agregar Hábito</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.card, currentTheme.card]} onPress={() => navigation.navigate('listHabit')}>
          <Text style={[styles.cardText, currentTheme.text]}>Listar Hábitos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.card, currentTheme.card]} onPress={() => navigation.navigate('detailHabit')}>
          <Text style={[styles.cardText, currentTheme.text]}>Ver Detalles de Hábitos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon
            name={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
            size={24}
            color={theme === 'light' ? '#000' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    container: { backgroundColor: '#fff' },
    text: { color: '#000' },
    card: { backgroundColor: '#f0f0f0' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    card: { backgroundColor: '#333' },
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default HomeScreen;