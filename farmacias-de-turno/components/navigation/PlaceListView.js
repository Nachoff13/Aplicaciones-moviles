import { View, Text, FlatList } from 'react-native';
import React from 'react';
import PlaceItem from './PlaceItem'

export default function PlaceListView({ placeList }) {
  // Imprime los nombres y direcciones de las farmacias
  console.log("*** Farmacia:", Array.isArray(placeList) ? placeList.map(item => ({
    nombre: item.displayName?.text || 'Nombre no disponible',
    direccion: item.formattedAddress || 'Dirección no disponible'
  })) : 'placeList no está disponible o no es un arreglo');

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