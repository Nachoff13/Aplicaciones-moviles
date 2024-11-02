import { View, StyleSheet } from 'react-native';
import React, {useState} from 'react';

import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';

export default function Index() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>

    <View>
      <View>
      <GoogleMapView />
      </View>
      <View style={styles.placeListContainer}>
        <PlaceListView placeList={undefined} selectedMarked={undefined} />
      </View>
    </View>
    </SelectMarkerContext.Provider>

  );
}

const styles = StyleSheet.create({
  placeListContainer:{
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
  }
});