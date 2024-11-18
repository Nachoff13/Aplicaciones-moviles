import { View, Text, Dimensions, useColorScheme } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { UserLocationContext } from '@/context/UserLocationContext';
import globalApi from '@/utils/globalApi';
import { StyleSheet } from 'react-native';
import PlaceListView from './PlaceListView';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../../database/firebase';
import Markers from './Markers';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import { ThemedView } from '../ThemedView';
import darkMapStyle from './DarkMapStyle';

export default function GoogleMapView() {
  //Guarda ubicación actual
  const { location } = useContext(UserLocationContext);
  //Guarda la lista de lugares cercanos de la api
  const [placeList, setPlaceList] = useState([]);
  //Guarda la región del mapa
  const [mapRegion, setMapRegion] = useState(null);
  // Determina el esquema de color del dispositivo
  const colorScheme = useColorScheme();
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [pharmaciesOnDuty, setPharmaciesOnDuty] = useState([]);

  // Función para obtener farmacias desde Firebase
  const fetchPharmaciesFromFirestore = async () => {
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      const pharmacySnapshot = await getDocs(pharmaciesCollection);
      const pharmacyList = pharmacySnapshot.docs.map(doc => doc.data());
      return pharmacyList;
    } catch (e) {
      console.error('Error al obtener las farmacias desde Firestore: ', e);
      return [];
    }
  };

  // Función para filtrar farmacias por direcciones y si le corresponde estar de turno hoy en farmaciasHardcodeadas
  const filterPharmaciesByAddressAndDate = (pharmacies, addresses) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

    return pharmacies.filter((pharmacy) => {
      const match =
        pharmacy.shortFormattedAddress &&
        addresses.some((addressObj) => {
          const address = addressObj.address;
          const turnDate = addressObj.turnDate;
          const addressMatch = pharmacy.shortFormattedAddress
            .toLowerCase()
            .includes(address.toLowerCase());
          const dateMatch = turnDate === todayString;
          return typeof address === 'string' && addressMatch && dateMatch;
        });
      return match;
    });
  };

  const filterIsOpenPharmacy = (pharmacies, pharmaciesOnDuty) => {
    return pharmacies.filter((pharmacy) => {
      const isOpen = pharmacy.currentOpeningHours?.openNow === true;
      const isOnDuty = pharmaciesOnDuty.some((dutyPharmacy) => {
        const match =
          dutyPharmacy.shortFormattedAddress === pharmacy.shortFormattedAddress;
        return match;
      });
      return isOpen || isOnDuty;
    });
  };

  // Va a traer las farmacias cercanas
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
      const farmaciasHardcodeadas = await fetchPharmaciesFromFirestore();
      setPharmaciesOnDuty(
        filterPharmaciesByAddressAndDate(pharmacies, farmaciasHardcodeadas)
      );

      pharmacies = filterIsOpenPharmacy(pharmacies, pharmaciesOnDuty);

      // Actualiza el estado con las farmacias filtradas
      setPlaceList(pharmacies);
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        console.error(
          'Error al llamar a la API:',
          error.response.data['error']['message']
        );
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