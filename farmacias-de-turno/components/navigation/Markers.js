import React from 'react'
import {Image} from 'react-native'
import {Marker} from 'react-native-maps'

export default function Markers({place}) {
  return place &&(
    <Marker
        coordinate={{
            latitude: place.location?.latitude,
            longitude: place.location?.longitude,
        }}
    >
        <Image
            source={require('../../assets/images/farmacia-marcador-1.png')} 
            style={{ width: 60, height: 60 }}
        />
    </Marker>
  )
}