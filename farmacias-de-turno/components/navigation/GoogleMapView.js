import { View, Text, Dimensions, Button, Alert, useColorScheme } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { UserLocationContext } from '@/context/UserLocationContext';
import globalApi from '@/utils/globalApi';
import { StyleSheet } from 'react-native';
import PlaceListView from './PlaceListView';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../../database/firebase';
import Markers from './Markers';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import { ThemedView } from '../ThemedView';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import darkMapStyle from './DarkMapStyle';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function GoogleMapView() {
  const [farmaciasHardcodeadas, setFarmaciasHardcodeadas] = useState([
    { address: 'Av. 60 Esq 10, La Plata' },
    { address: 'Calle 50 1051 B1900ATO, La Plata' },
  ]);

  // Guarda ubicación actual
  const { location } = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  // Determina el esquema de color del dispositivo
  const colorScheme = useColorScheme();

  const savePharmaciesToFirestore = async (pharmacies) => {
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of pharmacies) {
        const { displayName, formattedAddress, location } = pharmacy;
        const { latitude, longitude } = location;
        const name = displayName && displayName.text ? displayName.text.split(',')[0] : 'Nombre no disponible'; // Verificación de displayName
        await addDoc(pharmaciesCollection, {
          name,
          address: formattedAddress,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        });
      }
      console.log('Farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }
  };

  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.049,
      });
      getNearbyPlace();
    }
  }, [location]);

  useEffect(() => {
    if (selectedMarker !== null && placeList[selectedMarker]) {
      const { latitude, longitude } = placeList[selectedMarker].location;
      setMapRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    }
  }, [selectedMarker]);

  const getNearbyPlace = async () => {
    try {
      const data = {
        includedTypes: ['pharmacy'],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            },
            radius: 6000.0,
          },
        },
      };

      const response = await globalApi.NewNearbyPlace(data);
      let pharmacies = response.data?.places;

      console.log('Respuesta de la API:', pharmacies);

      // Filtrar farmacias por direcciones en farmaciasHardcodeadas (serían las farmacias de turno del csv)
      pharmacies = pharmacies.filter((pharmacy) => {
        const match =
          pharmacy.shortFormattedAddress &&
          farmaciasHardcodeadas.some((addressObj) => {
            const address = addressObj.address;
            console.log(
              `Comparando ${pharmacy.shortFormattedAddress} con ${address}`
            );
            return (
              typeof address === 'string' &&
              pharmacy.shortFormattedAddress
                .toLowerCase()
                .includes(address.toLowerCase())
            );
          });
        console.log(`¿Coincide ${pharmacy.shortFormattedAddress}? ${match}`);
        return match;
      });

      setPlaceList(pharmacies);
      await savePharmaciesToFirestore(pharmacies);
    } catch (error) {
      if (error.response) {
        console.error('Error al llamar a la API:', error.response.data['error']['message']);
      } else {
        console.error('Error al llamar a la API:', error.message);
      }
    }
  };

  const selectAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });
  
      console.log('Archivo seleccionado:', result);
  
      if (result.type === 'success') {
        const fileUri = result.uri;
  
        if (result.name.endsWith('.csv')) {
          // Procesar archivo CSV
          const response = await fetch(fileUri);
          const csvText = await response.text();
          const jsonData = Papa.parse(csvText, { header: true }).data;
          console.log('Datos CSV procesados:', jsonData);
          await uploadDataToFirestore(jsonData);
        } else if (result.name.endsWith('.xls') || result.name.endsWith('.xlsx')) {
          // Procesar archivo Excel
          const response = await fetch(fileUri);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          console.log('Datos Excel procesados:', jsonData);
          await uploadDataToFirestore(jsonData);
        }
  
        Alert.alert('Éxito', 'Datos guardados exitosamente en Firebase');
        verifyDataInFirestore();
      }
    } catch (error) {
      console.error('Error al cargar el archivo: ', error);
      Alert.alert('Error', 'Hubo un problema al cargar el archivo');
    }
  };

  const uploadDataToFirestore = async (data) => {
    try {
      const collectionRef = collection(db, 'pharmacies');
      for (const item of data) {
        const { address, latitude, longitude, name } = item;
        console.log('Datos a guardar:', { address, latitude, longitude, name });
        await addDoc(collectionRef, {
          address,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          name,
        });
        console.log(`Documento agregado: ${JSON.stringify(item)}`);
      }
      console.log('Datos guardados exitosamente en Firebase');
    } catch (e) {
      console.error('Error al guardar datos en Firebase: ', e);
    }
  };

  const verifyDataInFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pharmacies'));
      const data = querySnapshot.docs.map(doc => doc.data());
      console.log('Datos en Firestore:', data);
      Alert.alert('Verificación', 'Datos verificados en Firestore');
    } catch (e) {
      console.error('Error al verificar datos en Firebase: ', e);
      Alert.alert('Error', 'Hubo un problema al verificar los datos en Firebase');
    }
  };

  if (!mapRegion) {
    return (
      <ThemedView style={{ marginHorizontal: 20, overflow: 'hidden' }}>
        <Text style={{ color: '#004686', fontSize: 20, marginBottom: 10, fontWeight: '700', textAlign: 'center' }}>
          Cargando mapa...
        </Text>
      </ThemedView>
    );
  }

  return (
    <SelectMarkerContext.Provider
      value={{ selectedMarker, setSelectedMarker, setMapRegion }}
    >
      <ThemedView>
        <ThemedView style={{ borderRadius: 20, overflow: 'hidden' }}>
          <MapView
            style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height * 0.8, borderRadius: 20 }}
            provider={PROVIDER_DEFAULT}
            showsUserLocation={true}
            region={mapRegion}
            customMapStyle={colorScheme === 'dark' ? darkMapStyle : []} // Apply the dark mode style if in dark mode
          >
            {placeList &&
              placeList.map((item, index) => (
                <Markers key={index} place={item} index={index} />
              ))}
          </MapView>

          <View style={styles.placeListContainer}>
            {placeList && <PlaceListView placeList={placeList}></PlaceListView>}
          </View>
        </ThemedView>
        <Button title="Subir Archivo" onPress={selectAndUploadFile} />
      </ThemedView>
    </SelectMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
  },
});