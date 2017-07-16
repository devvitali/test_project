import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.dark,
    shadowColor: Colors.brand.black,
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 1.0,
    elevation: 2,
  },
});
export default props => (
  <View style={styles.container}>
    {props.children}
  </View>
);
