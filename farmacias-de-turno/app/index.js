import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import Constants from 'expo-constants';
import { ThemedView } from '@/components/ThemedView';

export default function Index() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <ThemedView style={styles.container}>
        <GoogleMapView />
        <ThemedView style={styles.placeListContainer}>
          <PlaceListView placeList={undefined} selectedMarked={undefined} />
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
});
