import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

const Navbar = () => {
  const { email, logout } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Mis Hábitos!</Text>
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
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#fff',
    fontSize: 16,
    padding: 8,
  },
});

export default Navbar;