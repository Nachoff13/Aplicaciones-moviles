import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';
import Header from '@/components/navigation/Header';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import Constants from 'expo-constants';
import { ThemedView } from '@/components/ThemedView';
import ShakeDetector from '@/components/navigation/ShakeDetector';
import ShakeModal from '@/components/navigation/ShakeModal';

export default function Index() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePlaceListUpdate = (places) => {
    setPlaceList(places);
  };

  const handleShake = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <ThemedView style={styles.container}>
        <Header />
        <GoogleMapView onPlaceListUpdate={handlePlaceListUpdate} />
        <ShakeDetector onShake={handleShake} />
        <ShakeModal visible={modalVisible} onClose={handleCloseModal} />
        <ThemedView style={styles.placeListContainer}>
          <PlaceListView placeList={placeList} />
        </ThemedView>
      </ThemedView>
    </SelectMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 10,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
});
