import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const HomeScreen = () => {
  const { userName, email } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Bienvenido {userName} ({email})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;