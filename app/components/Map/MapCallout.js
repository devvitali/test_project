import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import ExamplesRegistry from '../../services/example';

const styles = StyleSheet.create({
  callout: {
    position: 'relative',
    flex: 1,
  },
});
const MapCallout = ({ onPress, location }) => (
  <MapView.Callout style={styles.callout}>
    <TouchableOpacity onPress={() => onPress(location)}>
      <Text>{location.title}</Text>
    </TouchableOpacity>
  </MapView.Callout>
);
ExamplesRegistry.add('Map Callout', () => (
  <MapCallout
    location={{ title: 'Callout Example' }}
    onPress={() => window.alert('That tickles!')}
  />
));

export default MapCallout;
