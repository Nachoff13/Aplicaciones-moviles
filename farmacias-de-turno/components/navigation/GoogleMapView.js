import { View, Text, Dimensions, useColorScheme } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { UserLocationContext } from '@/context/UserLocationContext';
import globalApi from '@/utils/globalApi';
import { StyleSheet } from 'react-native';
import PlaceListView from './PlaceListView';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../database/firebase';
import Markers from './Markers';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import { ThemedView } from '../ThemedView';
import darkMapStyle from './DarkMapStyle';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function GoogleMapView() {
  const [farmaciasHardcodeadas, setFarmaciasHardcodeadas] = useState([
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
  ]);

  //Guarda ubicación actual
  const { location } = useContext(UserLocationContext);

  //Guarda la lista de lugares cercanos de la api
  const [placeList, setPlaceList] = useState([]);

  //Guarda la región del mapa
  const [mapRegion, setMapRegion] = useState(null);

  // Determina el esquema de color del dispositivo
  const colorScheme = useColorScheme();
  // Función para guardar farmacias en Firestore
  const savePharmaciesToFirestore = async (pharmacies) => {
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of pharmacies) {
        const { displayName, formattedAddress, location } = pharmacy;
        const { latitude, longitude } = location;
        await addDoc(pharmaciesCollection, {
          displayName,
          formattedAddress,
          latitude,
          longitude,
        });
      }
      console.log('Farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }
  };

  const [selectedMarker, setSelectedMarker] = useState([]);

  // Va a traer las farmacias cercanas
  // TODO: Poner restricción que sea solo farmacias de turno que vengan del csv
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
  
      console.log('Respuesta de la API:', response.data.places);
  
      let pharmacies = response.data?.places;
  
      // Verificar las direcciones de las farmacias obtenidas
      // pharmacies.forEach((pharmacy, index) => {
      //   console.log(`Farmacia ${index + 1}:`, pharmacy.shortFormattedAddress);
      // });
  
      // Filtra las farmacias que estan de turno el dia de la consulta
      const filterPharmaciesByDay = () => {
        const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
  
        return farmaciasHardcodeadas.filter((pharmacy) => {
          const pharmacyDate = pharmacy.turnDate;
  
          // Compara la fecha de turno con la fecha actual
          return pharmacyDate === today;
        });
      };
  
      // Filtra farmacias por direcciones en farmaciasHardcodeadas
      pharmacies = pharmacies.filter((pharmacy) => {
        const match =
          pharmacy.shortFormattedAddress &&
          farmaciasHardcodeadas.some((addressObj) => {
            const address = addressObj.address;
            console.log(`Comparando ${pharmacy.shortFormattedAddress} con ${address}`);
            return (
              typeof address === 'string' &&
              pharmacy.shortFormattedAddress
                .toLowerCase()
                .includes(address.toLowerCase())
            );
          });
  
        // Compara si el dia actual es el mismo que el de turno de la farmacia
        const isToday = filterPharmaciesByDay().some(
          (pharmacyToday) => pharmacyToday.address === pharmacy.shortFormattedAddress
        );
  
        console.log(`¿Es hoy el día de turno de ${pharmacy.shortFormattedAddress}? ${isToday}`);
        return match && isToday; // Solo incluye la farmacia si la dirección y el dia de turno coinciden
      });
  
      // Actualiza el estado con las farmacias filtradas
      setPlaceList(pharmacies);
  
      // Guardar farmacias en Firestore
      await savePharmaciesToFirestore(pharmacies);
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        console.error('Error al llamar a la API:', error.response.data['error']['message']);
      } else {
        console.error('Error al llamar a la API:', error.message);
      }
    }
  };

  useEffect(() => {
    // Inicializa el mapa con la ubicación del usuario
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.049,
      });
      getNearbyPlace();
    }

    // Centra el mapa en el marcador seleccionado o en la farmacia seleccionada en el carrusel
    if (selectedMarker !== null && placeList[selectedMarker]) {
      const { latitude, longitude } = placeList[selectedMarker].location;
      setMapRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    }
  }, [location, selectedMarker]);

  if (!mapRegion) {
    return (
      <ThemedView style={{ marginHorizontal: 20, overflow: 'hidden' }}>
        <Text
          style={{
            color: '#004686',
            fontSize: 20,
            marginBottom: 10,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
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
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height * 0.8,
              borderRadius: 20,
            }}
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
