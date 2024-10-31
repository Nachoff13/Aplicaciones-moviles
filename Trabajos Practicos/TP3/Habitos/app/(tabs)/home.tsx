import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HomeScreen: React.FC = () => {
  const {email} = useAuth(); // Obtiene los valores del contexto

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Bienvenido {email}!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
  },
});

export default HomeScreen;