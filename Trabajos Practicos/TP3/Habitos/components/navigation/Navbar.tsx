import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Navbar = () => {
  const { email, logout } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mis Hábitos!</Text>
      </View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Text style={styles.userEmail}>{email}</Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={handleLogout} title="Cerrar sesión" />
      </Menu>
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Icon
          name={theme === 'light' ? 'weather-night' : 'white-balance-sunny'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
    backgroundColor: '#4285F4',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  userEmail: {
    color: '#fff',
    fontSize: 16,
    padding: 8,
  },
});

export default Navbar;