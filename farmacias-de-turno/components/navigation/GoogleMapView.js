import { View, Text, Dimensions } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { UserLocationContext } from '../../context/UserLocationContext';

export default function GoogleMapView() {

  //Guarda ubicación actual
  const { location } = useContext(UserLocationContext);

  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0921,
      });
    }
  }, [location]);

  if (!mapRegion) {
    return (
      <View style={{ marginTop: 50, marginHorizontal: 20, overflow: 'hidden' }}>
        <Text style={{ color:'#004686', fontSize: 20, marginBottom: 10, fontWeight: '700', textAlign: 'center' }}>
          Cargando mapa...
        </Text>
      </View>
    );
  }
  return (
    <View style={{marginTop:50, marginHorizontal:20, overflow:'hidden'}}>
      <Text style={{color:'#004686', marginBottom:10,fontWeight:'700', fontSize:20 }}>
        Farmacias de Turno
      </Text>
      <View style={{ borderRadius: 20, overflow: 'hidden' }}>

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
    </View>
  )
}