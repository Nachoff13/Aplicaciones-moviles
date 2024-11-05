import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../constants/HomeScreenStyles'; // Importar los estilos

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
  const { theme } = useTheme();
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
    </View>
  );
};

export default HomeScreen;