import React from 'react';
import MapView from 'react-native-maps';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Images, Fonts, Colors } from '../../themes';
const styles = StyleSheet.create({
  clusterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 3,
  },
  labelClusterCount: {
    fontFamily: Fonts.type.primary,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: Fonts.size.medium,
  },
});

export const BarMarker = ({ bar, onPress }) => {
  if (!bar) {
    return null;
  }
  const { address, currentDrinkUp, specialId } = bar;
  let zIndex = 0;
  if (!address) {
    return null;
  }
  let image = '';
  if (currentDrinkUp && specialId) {
    image = Images.pinMugSeal;
    zIndex = 4;
  } else if (currentDrinkUp) {
    image = Images.pinMug;
    zIndex = 3;
  } else if (specialId) {
    image = Images.pinSeal;
    zIndex = 2;
  } else {
    image = Images.pin;
    zIndex = 1;
  }
  return (
    <MapView.Marker onPress={onPress} coordinate={address} zIndex={zIndex}>
      <Image source={image} />
    </MapView.Marker>
  );
};

export const ClusterMarker = ({ marker, onPress }) => {
  const fontSize = (Fonts.size.medium - marker.count.length) + 1;
  return (
    <MapView.Marker coordinate={marker} onPress={onPress}>
      <Image source={Images.pin} />
      <View style={styles.clusterContainer}>
        <Text style={[styles.labelClusterCount, { fontSize }]}>
          {marker.count}
        </Text>
      </View>
    </MapView.Marker>
  );
};
