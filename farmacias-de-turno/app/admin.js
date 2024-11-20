import React, { useState, useEffect } from 'react';
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import styles from '@/components/AdminStyles.tsx';
import { handleFileUpload } from '@/components/navigation/fileUploadHandler';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/database/firebase';

export default function Admin() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState('');
  const [farmacias, setFarmacias] = useState([]);
  const [origin, setOrigin] = useState('firestore'); // Alterna entre farmacias de firestore y las nuevas upload

  // Carga farmacias desde Firestore
  useEffect(() => {
    if (origin === 'firestore') {
      const fetchFarmacias = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'pharmacies'));
          const farmaciasData = querySnapshot.docs.map((doc) => doc.data());
          setFarmacias(farmaciasData);
        } catch (error) {
          console.error('Error al obtener las farmacias de Firestore: ', error);
        }
      };

      fetchFarmacias();
    }
  }, [origin]);

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredFarmacias = farmacias.filter((item) => {
    const name = item.name ? removeAccents(item.name.toLowerCase()) : '';
    const address = item.address
      ? removeAccents(item.address.toLowerCase())
      : '';
    const turnDate = item.turnDate
      ? removeAccents(item.turnDate.toLowerCase())
      : '';
    const phone = item.phone ? item.phone : '';

    return (
      name.includes(removeAccents(searchText.toLowerCase())) ||
      address.includes(removeAccents(searchText.toLowerCase())) ||
      turnDate.includes(removeAccents(searchText.toLowerCase())) ||
      phone.includes(searchText)
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <ThemedText style={styles.cell}>{item.name}</ThemedText>
      <ThemedText style={styles.cell}>{item.address}</ThemedText>
      <ThemedText style={styles.cell}>{item.turnDate}</ThemedText>
      <ThemedText style={styles.cell}>{item.phone}</ThemedText>
    </View>
  );

  const clearSearch = () => {
    setSearchText('');
  };

  const handleUpload = async () => {
    const newPharmacies = await handleFileUpload();
    if (newPharmacies.length > 0) {
      setFarmacias(newPharmacies);
      setOrigin('upload'); // Cambia el origen a upload despues de cargar el archivo
      Alert.alert('Archivo cargado', 'Se mostrará la nueva lista de farmacias.');
    } else {
      Alert.alert('Error', 'No se cargaron farmacias válidas.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={
          (colorScheme === 'light' && styles.inputLightView) ||
          (colorScheme === 'dark' && styles.inputDarkView)
        }
        placeholder="Buscar farmacia..."
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
        <ThemedText style={styles.clearButtonText}>Limpiar Búsqueda</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={filteredFarmacias}
        renderItem={renderItem}
        keyExtractor={(item) => item.phone || Math.random().toString()}
        ListHeaderComponent={
          <View style={styles.row}>
            <ThemedText style={[styles.cell, styles.header]}>Nombre</ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>Dirección</ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>Fecha de Turno</ThemedText>
            <ThemedText style={[styles.cell, styles.header]}>Teléfono</ThemedText>
          </View>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <ThemedText style={styles.uploadButtonText}>
            Cargar Archivo
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}