import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../components/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Icon
        name={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
        size={24}
        color={theme === 'light' ? '#000' : '#fff'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default ThemeToggleButton;