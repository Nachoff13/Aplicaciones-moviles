import React, {useEffect, useRef, useContext} from 'react';
import { View, FlatList, Dimensions } from 'react-native';

import PlaceItem from './PlaceItem'
import { SelectMarkerContext } from '@/context/SelectMarkerContext';


export default function PlaceListView({ placeList, selectedMarked }) {

  const flatListRef = useRef(null);
  const selectedMarker=selectedMarked
  const { setSelectedMarker} = useContext(SelectMarkerContext);
  console.log('PlaceListView:', selectedMarker);
  useEffect(() => {
    selectedMarker&&scrollToIndex(selectedMarker);
  }, []);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({animated:true, index});
  };
  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width*index,
    index,
  });

  return (
    <SelectMarkerContext.Provider value={{selectedMarker}}>
    <View>
      <FlatList
        data={Array.isArray(placeList) ? placeList : []}
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item,index }) => (
          <View key={index}>
            <PlaceItem place={item}/>
          </View>
        )}
      />
    </View>
    </SelectMarkerContext.Provider>
  );
}