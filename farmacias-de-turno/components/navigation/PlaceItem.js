import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import React from 'react';
import Config from 'react-native-config';

export default function PlaceItem({ place }) {

  const apiKey = Config.GOOGLE_MAPS_API_KEY;

  const photoReference = place.photos && place.photos.length > 0 ? place.photos[0].photo_reference : null;
  
  const imageUrl = photoReference 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}` 
    : null;

  return (
    <View 
      style={{
        width: Dimensions.get('screen').width * 0.91,
        backgroundColor: '#FFFFFF',
        paddingBottom: 10,
        marginRight: 10,
        borderRadius: 20,
      }}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} // Usa la URL de la foto
          style={{ width: '100%', borderRadius: 10, height: 130 }} 
        />
      ) : (
        <Image 
          source={require('../../assets/images/farmacia-item.jpg')} // Imagen por defecto
          style={{ width: '100%', borderRadius: 10, height: 130}} 
        />
      )}
      <Text
        style={{
          color: '#004686',
          fontSize: 16,
          fontWeight: '700',
          marginTop: 10,
          marginBottom: 5,
          marginLeft: 5
        }}
      >
        {place.displayName?.text || 'Nombre no disponible'}
      </Text>
      <Text
        style={{
          color: '#004686',
          fontSize: 14,
          marginLeft: 5,
        }}
      >{place.formattedAddress || 'Dirección no disponible'}</Text>
    </View>
  );
}