import { View, StyleSheet } from 'react-native';
import React from 'react';

import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';

export default function Index() {
  return (
    <View>
      <View>
      <GoogleMapView />
      </View>
      <View style={styles.placeListContainer}>
        <PlaceListView placeList={undefined} />
      </View>
    </View>
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