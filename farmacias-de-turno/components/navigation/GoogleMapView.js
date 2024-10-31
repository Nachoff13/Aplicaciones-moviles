import { View, Text, Dimensions } from 'react-native'
import React, { useState, useContextC, useEffect } from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'

export default function GoogleMapView() {

  //Guarda ubicación actual
  const [location, setLocation] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  const [mapRegion, setmapRegion] = useState({
    latitude: -34.97249957852252 ,
    longitude: -57.97549635928252,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  });


  //Verifica mi ubicación todo el tiempo
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación no otorgado');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);



  return (
    <View style={{marginTop:35, marginHorizontal:20}}>
      <Text style={{fontSize:20, marginBottom:10,fontWeight:'600',textAlign:'center'}}>
        Farmacias de Turno
      </Text>
        <MapView
            style={{
              width:Dimensions.get('screen'),
              height:Dimensions.get('screen').height*0.8,
              borderRadius:20
            }}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          region={mapRegion}
          >
        </MapView>
    </View>
  )
}