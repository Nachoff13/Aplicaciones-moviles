import { View, Text, FlatList, Image, Dimensions  } from 'react-native';
import React from 'react';

export default function PlaceItem({ place }) {
  

  return (
    <View 
    style={{
        width:Dimensions.get('screen').width * 0.9,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
    }}
    >
        <Image source={require('../../assets/images/farmacia.png')}
        style={ {width:'100%', borderRadius:10, height:130} }
        >
        </Image>
        <Text>{place.displayName?.text || 'Nombre no disponible'}</Text>
        <Text>{place.formattedAddress || 'Dirección no disponible'}</Text>
    </View>
  );
}