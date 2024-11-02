import { View, FlatList } from 'react-native';
import React from 'react';
import PlaceItem from './PlaceItem'

export default function PlaceListView({ placeList }) {

  return (
    <View>
      <FlatList
        data={Array.isArray(placeList) ? placeList : []}
        horizontal={true}
        showsHorizontalScrollIndicator={false}

        renderItem={({ item,index }) => (
          <View key={index}>
            <PlaceItem place={item}/>
          </View>
        )}
      />
    </View>
  );
}