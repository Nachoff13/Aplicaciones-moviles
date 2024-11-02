import { View, Text } from 'react-native';
import React, { useContext } from 'react';

import PlaceListView from '@/components/navigation/PlaceListView';
import GoogleMapView from '@/components/navigation/GoogleMapView';

export default function Index() {
  return (
    <View>
      <View>
      <GoogleMapView />
      </View>
      <View>
        <PlaceListView placeList={undefined} />
      </View>
    </View>
  );
}