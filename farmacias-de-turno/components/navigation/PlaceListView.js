import React, { useEffect, useContext, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { selectedMarker, setSelectedMarker, setMapRegion } = useContext(SelectMarkerContext);

  useEffect(() => {
    if (selectedMarker !== null && placeList.length > selectedMarker) {
      scrollToIndex(selectedMarker);

      // Centra el mapa en la farmacia seleccionada
      const selectedPlace = placeList[selectedMarker];
      setMapRegion({
        latitude: selectedPlace.location.latitude,
        longitude: selectedPlace.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [selectedMarker]);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setSelectedMarker(index);
  };

  return (
    <View>
      <FlatList
        data={Array.isArray(placeList) ? placeList : []}
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => (
          <View key={index}>
            <PlaceItem place={item} />
          </View>
        )}
      />
    </View>
  );
}