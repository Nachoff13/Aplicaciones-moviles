import React, { useEffect, useContext, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '@/context/SelectMarkerContext';

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);

  useEffect(() => {
    if (selectedMarker !== null && placeList.length > selectedMarker) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker]);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (data, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index,
  });

  return (
    <View>
      <FlatList
        data={Array.isArray(placeList) ? placeList : []}
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View key={index}>
            <PlaceItem place={item} />
          </View>
        )}
      />
    </View>
  );
}