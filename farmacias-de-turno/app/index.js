import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Constants from 'expo-constants';

export default function Index() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const colorScheme = useColorScheme();
  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <View style={styles.container}>
        <GoogleMapView />
        <View style={styles.placeListContainer}>
          <PlaceListView placeList={undefined} selectedMarked={undefined} />
        </View>
      </View>
    </SelectMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: Colors.light.background,
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
