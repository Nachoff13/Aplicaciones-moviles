import { View, Text } from 'react-native';
import React, { useContext } from 'react';


import GoogleMapView from '../components/navigation/GoogleMapView';

export default function Index() {
  return (
    <View>
      <GoogleMapView />
    </View>
  );
}