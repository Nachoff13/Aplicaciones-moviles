import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';

const farmaciasHardcodeadas = [
  {
    address: 'Av. 60 Esq 10, La Plata',
    turnDate: '2024-11-15',
    name: 'Farmacia Argentina Homeopática',
    phone: '221-422-1000',
  },
  {
    address: 'Calle 50 1051 B1900ATO, La Plata',
    turnDate: '2024-11-16',
    name: 'Farmacia de Turno La Plata',
    phone: '221-423-1000',
  },
  {
    address: 'Av. 32 1200, La Plata',
    turnDate: '2024-11-17',
    name: 'Farmacia Plaza',
    phone: '221-424-2000',
  },
  {
    address: 'Calle 123 5500, La Plata',
    turnDate: '2024-11-18',
    name: 'Farmacia del Sol',
    phone: '221-425-3000',
  },
  {
    address: 'Calle 45 2200, La Plata',
    turnDate: '2024-11-19',
    name: 'Farmacia del Centro',
    phone: '221-426-4000',
  },
  {
    address: 'Av. 44 1000, La Plata',
    turnDate: '2024-11-20',
    name: 'Farmacia San Martín',
    phone: '221-427-5000',
  },
  {
    address: 'Calle 10 1200, La Plata',
    turnDate: '2024-11-21',
    name: 'Farmacia El Águila',
    phone: '221-428-6000',
  },
  {
    address: 'Calle 80 3100, La Plata',
    turnDate: '2024-11-22',
    name: 'Farmacia Santa Fe',
    phone: '221-429-7000',
  },
  {
    address: 'Av. 7 2000, La Plata',
    turnDate: '2024-11-23',
    name: 'Farmacia Los Andes',
    phone: '221-430-8000',
  },
  {
    address: 'Calle 61 4500, La Plata',
    turnDate: '2024-11-24',
    name: 'Farmacia del Norte',
    phone: '221-431-9000',
  },
];

export default function Admin() {
  let colorScheme = useColorScheme();

  const [searchText, setSearchText] = useState('');

  // Función para eliminar acentos y normalizar las cadenas
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filtra las farmacias según el texto de búsqueda (ignorando mayúsculas y tildes)
  const filteredFarmacias = farmaciasHardcodeadas.filter(
    (item) =>
      removeAccents(item.name.toLowerCase()).includes(
        removeAccents(searchText.toLowerCase())
      ) ||
      removeAccents(item.address.toLowerCase()).includes(
        removeAccents(searchText.toLowerCase())
      ) ||
      removeAccents(item.turnDate.toLowerCase()).includes(
        removeAccents(searchText.toLowerCase())
      ) ||
      item.phone.includes(searchText)
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <ThemedText style={styles.cell}>{item.name}</ThemedText>
      <ThemedText style={styles.cell}>{item.address}</ThemedText>
      <ThemedText style={styles.cell}>{item.turnDate}</ThemedText>
      <ThemedText style={styles.cell}>{item.phone}</ThemedText>
    </View>
  );

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Input de búsqueda */}
      <TextInput
        style={
          (colorScheme === 'light' && styles.inputLightView) ||
          (colorScheme === 'dark' && styles.inputDarkView)
        }
        placeholder="Buscar farmacia..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Botón Limpiar Búsqueda */}
      <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
        <ThemedText style={styles.clearButtonText}>Limpiar Búsqueda</ThemedText>
      </TouchableOpacity>

      {/* Lista filtrada */}
      <FlatList
        data={filteredFarmacias}
        renderItem={renderItem}
        keyExtractor={(item) => item.phone} // Usamos el teléfono como clave única
        ListHeaderComponent={
          <View style={styles.row}>
            <ThemedText style={[styles.cell, styles.header]}>Nombre</ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>
              Dirección
            </ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>
              Fecha de Turno
            </ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>
              Teléfono
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    paddingTop: Constants.statusBarHeight,

    paddingHorizontal: 10,
  },
  inputLightView: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#000',
  },
  inputDarkView: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#007BFF', // Color azul
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
