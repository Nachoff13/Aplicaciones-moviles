import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Dimensions, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import MarcadorFarmacia from '@/components/MarcadorFarmacia';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const { height } = Dimensions.get('window');

const generateRandomLocations = (num: number, region: Region): LocationCoords[] => {
  const locations: LocationCoords[] = [];
  for (let i = 0; i < num; i++) {
    const latitude = region.latitude + (Math.random() - 0.5) * region.latitudeDelta;
    const longitude = region.longitude + (Math.random() - 0.5) * region.longitudeDelta;
    locations.push({ latitude, longitude });
  }
  return locations;
};

export default function App() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [randomLocations, setRandomLocations] = useState<LocationCoords[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Actualiza cada segundo
          distanceInterval: 1, // Actualiza cada metro
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );

      headingSubscription = await Location.watchHeadingAsync((heading) => {
        setHeading(heading.trueHeading);
      });

      if (location) {
        const region: Region = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        setRandomLocations(generateRandomLocations(10, region));
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (headingSubscription) {
        headingSubscription.remove();
      }
    };
  }, []);
console.log(location)
  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      } as Region);
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {randomLocations.map((loc, index) => (
            <Marker key={index} coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}>
            <MarcadorFarmacia title={`Farmacia ${index + 1}`} />
          </Marker>
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Center Map" onPress={centerMap} />
        {heading !== null && (
          <Text style={styles.headingText}>Heading: {heading.toFixed(2)}°</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    padding: 10,
  },
  headingText: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
});