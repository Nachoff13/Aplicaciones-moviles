import { View, Text, Dimensions, useColorScheme, StyleSheet } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { UserLocationContext } from '@/context/UserLocationContext';
import globalApi from '@/utils/globalApi';
import PlaceListView from './PlaceListView';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../database/firebase';
import Markers from './Markers';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import { ThemedView } from '../ThemedView';
import darkMapStyle from './DarkMapStyle';
import { PharmacyContext } from '@/context/PharmacyContext';
import { usePharmacy } from '@/context/PharmacyContext';

// Función para normalizar direcciones
const normalizeAddress = (address) => {
  return address.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();
};

// Función para comparar direcciones normalizadas
const compareAddresses = (address1, address2) => {
  const normalizedAddress1 = normalizeAddress(address1);
  const normalizedAddress2 = normalizeAddress(address2);
  return normalizedAddress1 === normalizedAddress2;
};

// Componente principal de GoogleMapView
export default function GoogleMapView() {
  const { location } = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const colorScheme = useColorScheme();
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [pharmaciesOnDuty, setPharmaciesOnDuty] = useState([]);
  const { pharmacies } = usePharmacy();

  useEffect(() => {
    if (pharmacies.length > 0) {
      console.log('Farmacias cargadas en GoogleMapView', pharmacies);
    }
  }, [pharmacies]);

  const fetchPharmaciesFromFirestore = async () => {
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      const pharmacySnapshot = await getDocs(pharmaciesCollection);
      return pharmacySnapshot.docs.map(doc => doc.data());
    } catch (e) {
      console.error('Error al obtener las farmacias desde Firestore: ', e);
      return [];
    }
  };

  const filterPharmaciesByAddressAndDate = (pharmacies, addresses) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return pharmacies.filter(pharmacy => {
      return addresses.some(addressObj => {
        const address = addressObj.address;
        const turnDate = addressObj.turnDate;
        const addressMatch = compareAddresses(pharmacy.shortFormattedAddress, address);
        const dateMatch = turnDate === todayString;
        return addressMatch && dateMatch;
      });
    });
  };

  const filterIsOpenPharmacy = (pharmacies, pharmaciesOnDuty) => {
    return pharmacies.filter(pharmacy => {
      const isOpen = pharmacy.currentOpeningHours?.openNow === true;
      const isOnDuty = pharmaciesOnDuty.some(dutyPharmacy => 
        compareAddresses(dutyPharmacy.shortFormattedAddress, pharmacy.shortFormattedAddress)
      );
      return isOpen || isOnDuty;
    });
  };

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

      //console.log('Farmacias obtenidas de la API:', pharmacies);

      const farmaciasHardcodeadas = await fetchPharmaciesFromFirestore();
      setPharmaciesOnDuty(filterPharmaciesByAddressAndDate(pharmacies, farmaciasHardcodeadas));

      pharmacies = filterIsOpenPharmacy(pharmacies, pharmaciesOnDuty);

      const pharmaciesFromContext = filterIsOpenPharmacy(pharmacies, pharmaciesOnDuty);

      const combinedPharmacies = [
        ...pharmacies, 
        ...pharmaciesFromContext, 
      ];

      const uniquePharmacies = [
        ...new Map(combinedPharmacies.map(pharmacy => [pharmacy.address, pharmacy])).values()
      ];

      setPlaceList(uniquePharmacies);

    } catch (error) {
      console.error('Error al llamar a la API:', error.message);
    }
  };

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

    if (selectedMarker !== null && placeList[selectedMarker]) {
      const { latitude, longitude } = placeList[selectedMarker].location;
      setMapRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    }
  }, [location, selectedMarker, pharmacies]);

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
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker, setMapRegion }}>
      <PharmacyContext.Provider value={{ pharmacies }}>
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
              customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
            >
              {placeList && placeList.map((item, index) => (
                <Markers key={index} place={item} index={index} />
              ))}
            </MapView>

            <View style={styles.placeListContainer}>
              {placeList && <PlaceListView placeList={placeList}></PlaceListView>}
            </View>
          </ThemedView>
        </ThemedView>
      </PharmacyContext.Provider>
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