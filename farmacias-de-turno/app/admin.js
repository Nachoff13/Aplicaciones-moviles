import React, { useState } from 'react';
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx'; // Para convertir el Excel a JSON
import { firebaseConfig } from '@/database/firebase'; // Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styles from '@/components/AdminStyles.tsx'; // Importar estilos desde el archivo separado

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState('');

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

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

  const clearSearch = () => {
    setSearchText('');
  };

  const handleFileUpload = async () => {
    try {
      // Selecciona el archivo
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });

      if (res.type === 'cancel') {
        console.log('El usuario canceló la selección del archivo');
        return;
      }

      // Verifica que la URI del archivo no sea nula
      const fileUri = res.uri;
      console.log('File URI:', fileUri); // Agregar console.log para verificar la URI
      if (!fileUri) {
        throw new Error('No se pudo obtener la URI del archivo');
      }

      // Lee el archivo Excel y conviértelo a JSON
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileData, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log('Excel parsed:', jsonData);

      // Convierte cada farmacia a la estructura que Firebase espera
      const pharmacies = jsonData.map(item => ({
        year: item.año,
        month: item.mes,
        day: item.dia,
        name: item.nombre,
        address: item.direccion,
        phone: item.telefono,
      }));

      // Guarda las farmacias en Firebase
      try {
        const pharmaciesCollection = collection(db, 'pharmacies');
        for (const pharmacy of pharmacies) {
          await addDoc(pharmaciesCollection, pharmacy);
        }
        console.log('Farmacias guardadas exitosamente en Firestore');
      } catch (e) {
        console.error('Error al guardar las farmacias en Firestore: ', e);
      }
    } catch (err) {
      console.error('Error al seleccionar el archivo: ', err);
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
        keyExtractor={(item) => item.phone}
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
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <ThemedText style={styles.uploadButtonText}>Cargar Archivo</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}