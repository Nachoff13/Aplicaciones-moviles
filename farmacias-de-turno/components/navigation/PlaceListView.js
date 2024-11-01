import { View, Text, FlatList } from 'react-native';
import React from 'react';
import PlaceItem from './PlaceItem'

export default function PlaceListView({ placeList }) {
  // Verifica si placeList es un arreglo y obtiene el primer elemento
  if (Array.isArray(placeList) && placeList.length > 0) {
    const firstPlace = placeList[0];
    console.log("*** Farmacia:", {
      nombre: firstPlace.displayName?.text || 'Nombre no disponible',
      direccion: firstPlace.formattedAddress || 'Dirección no disponible',
      fotos: firstPlace.photos ? firstPlace.photos.map(photo => photo.flagContentUri).join(', ') : 'No hay fotos disponibles'
    });
  } else {
    console.log('placeList no está disponible o no es un arreglo');
  }

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