import { View, Text, Dimensions } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { UserLocationContext } from "@/context/UserLocationContext";
import globalApi from "@/utils/globalApi";
import { StyleSheet } from "react-native";
import PlaceListView from "./PlaceListView";
import { initializeApp } from "firebase/app"; 
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { firebaseConfig } from "../../database/firebase";	
import Markers from "./Markers";
import { SelectMarkerContext } from "@/context/SelectMarkerContext";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default function GoogleMapView() {
  //Guarda ubicación actual
  const { location } = useContext(UserLocationContext);

  //Guarda la lista de lugares cercanos de la api
  const [placeList, setPlaceList] = useState([]);

  //Guarda la región del mapa
  const [mapRegion, setMapRegion] = useState(null);

  // Función para guardar farmacias en Firestore
  const savePharmaciesToFirestore = async (pharmacies) => {
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of pharmacies) {
        await addDoc(pharmaciesCollection, pharmacy);
      }
      console.log('Farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }
  };

  const [selectedMarker, setSelectedMarker] = useState([]);

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

      const pharmacies = response.data?.places;
      setPlaceList(pharmacies);

      // Guardar farmacias en Firestore
      await savePharmaciesToFirestore(pharmacies);
      
    } catch (error) {
      if (error.response) {
        console.error('Error al llamar a la API:', error.response.data['error']['message']);
      } else {
        console.error('Error al llamar a la API:', error.message);
      }
    }
  };
  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0490,
      });
      getNearbyPlace();
    }
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
    <SelectMarkerContext.Provider value={{selectedMarker,setSelectedMarker}}>
    <View>
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
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height * 0.8,
            borderRadius: 20,
          }}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          region={mapRegion}
        >
          {/* <Marker title="ACA ESTAS VOS" coordinate={mapRegion}></Marker> */}
          {placeList && placeList.map((item, index) => (
            <Markers key={index} place={item} index={index}/>
            
          ))}
        </MapView>
        <View style={styles.placeListContainer}>
          {placeList&&<PlaceListView placeList={placeList} ></PlaceListView>}
          {console.log('GoogleMapView:', selectedMarker)}
        </View>
      </View>
    </View>
    </View>
    </SelectMarkerContext.Provider>
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