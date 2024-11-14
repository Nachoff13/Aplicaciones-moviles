import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import globalApi from '@/utils/globalApi';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import Constants from 'expo-constants';

export default function PlaceItem({ place }) {
  const PLACE_PHOTO_BASE_URL = 'https://places.googleapis.com/v1/';
  const [photoUrl, setPhotoUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (place?.photos) {
        const url = `${PLACE_PHOTO_BASE_URL}${place?.photos[0]?.name}/media?key=${globalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200`;
        try {
          const response = await fetch(url);
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            // La respuesta es un JSON (probablemente un error)
            setPhotoUrl(null);
          } else {
            // La respuesta es una imagen
            setPhotoUrl(url);
          }
        } catch (error) {
          console.error('Error al verificar la URL de la foto:', error);
          setPhotoUrl(null);
        }
      } else {
        setPhotoUrl(null);
      }
    };

    fetchPhotoUrl();
  }, [place]);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          imageError || !photoUrl
            ? require('../../assets/images/farmacia-item.jpg') // Imagen de la farmacia
            : { uri: photoUrl }
        }
        style={styles.image}
        onError={() => setImageError(true)}
      />

      <ThemedView style={styles.textContainer}>
        <ThemedText type="subtitle">
          {place.displayName?.text || 'Nombre no disponible'}
        </ThemedText>
        <ThemedText type="subtitle">
          {place.shortFormattedAddress || 'Dirección no disponible'}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width * 0.9165,
    margin: 5,
    borderRadius: 10,
  },
  textContainer: {
    padding: 15,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    borderRadius: 10,
    height: 150,
    zIndex: -1,
  },
});