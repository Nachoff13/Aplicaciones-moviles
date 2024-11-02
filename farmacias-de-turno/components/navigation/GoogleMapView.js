import { View, Text, Dimensions } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { UserLocationContext } from "@/context/UserLocationContext";
import globalApi from "@/utils/globalApi";
import { StyleSheet } from "react-native";
import PlaceListView from "./PlaceListView";

export default function GoogleMapView() {
  //Guarda ubicación actual
  const { location } = useContext(UserLocationContext);

  //Guarda la lista de lugares cercanos de la api
  const [placeList, setPlaceList] = useState([]);

  //Guarda la región del mapa
  const [mapRegion, setMapRegion] = useState(null);

  // Va a traer las farmacias cercanas
  // TODO: Poner restricción que sea solo farmacias de turno que vengan del csv
  const getNearbyPlace = async () => {
    try {
      const data = {
        includedTypes: ['pharmacy'],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            },
            radius: 6000.0,
          },
        },
      };

      const response = await globalApi.NewNearbyPlace(data);

      //console.log('Respuesta de la API:', response.data);

      setPlaceList(response.data?.places);
      
    } catch (error) {
      if (error.response) {
        console.error('Error al llamar a la API:', error.response.data['error']['message']);
        console.error('Código de estado:', error.response.status);
        console.error('Encabezados:', error.response.headers);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error('No se recibió respuesta de la API:', error.request);
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        console.error('Error al configurar la solicitud:', error.message);
      }
      console.error('Configuración de la solicitud:', error.config);
    }
  };

  useEffect(() => {
    location &&
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0921,
      });
    
    location && getNearbyPlace();
  }, [location]);

  if (!mapRegion) {
    return (
      <View style={{ marginTop: 50, marginHorizontal: 20, overflow: "hidden" }}>
        <Text
          style={{
            color: "#004686",
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Cargando mapa...
        </Text>
      </View>
    );
  }
  return (
    <View style={{ marginTop: 50, marginHorizontal: 20, overflow: "hidden" }}>
      <Text
        style={{
          color: "#004686",
          marginBottom: 10,
          fontWeight: "700",
          fontSize: 20,
        }}
      >
        Farmacias de Turno
      </Text>
      <View style={{ borderRadius: 20, overflow: "hidden" }}>
        <MapView
          style={{
            width: Dimensions.get("screen"),
            height: Dimensions.get("screen").height * 0.8,
            borderRadius: 20,
          }}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          region={mapRegion}
        >
          <Marker title="ACA ESTAS VOS" coordinate={mapRegion}></Marker>
        </MapView>

        <View style={styles.placeListContainer}>
          {placeList&&<PlaceListView placeList={placeList}></PlaceListView>}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeListContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%"
  },
});