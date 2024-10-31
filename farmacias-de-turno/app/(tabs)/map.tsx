import { View, Text } from 'react-native';
import React from 'react';
import GoogleMapView from '../../components/navigation/GoogleMapView';

export default function Map() {
  return (
    <View>
      <Text>Map</Text>
      <GoogleMapView />
    </View>
  );
}