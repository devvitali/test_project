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
  if (!address) {
    return null;
  }
  let image = '';
  if (currentDrinkUp && specialId) {
    image = Images.pinMugSeal;
  } else if (currentDrinkUp) {
    image = Images.pinMug;
  } else if (specialId) {
    image = Images.pinSeal;
  } else {
    image = Images.pin;
  }
  return (
    <MapView.Marker onPress={onPress} coordinate={address}>
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
