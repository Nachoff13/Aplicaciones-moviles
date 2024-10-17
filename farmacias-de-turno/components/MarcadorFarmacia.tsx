import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MarcadorFarmacia = ({ title }: { title: string }) => {
  return (
    <View style={styles.markerContainer}>
      <Image source={require('@/assets/images/farmacia.png')} />
      <Text style={styles.markerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  markerText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
  },
});

export default MarcadorFarmacia;