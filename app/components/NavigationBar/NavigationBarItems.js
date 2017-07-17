import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import IconAlko from '../IconAlko';
import styles from './styles';
import { Colors } from '../../themes';

export default {
  backButton() {
    return (
      <TouchableOpacity onPress={() => {}} style={styles.backButton}>
        <Icon name="angle-left" size={35} color={Colors.snow} style={styles.backIcon} />
      </TouchableOpacity>
    );
  },

  hamburgerButton(onPress) {
    return () => (
      <TouchableOpacity onPress={() => {}} style={styles.navButtonLeft}>
        <IconAlko name="sidebar_toggle" size={20} color={Colors.snow} />
      </TouchableOpacity>
    );
  },

  mapButton(onPress) {
    return () => (
      <TouchableOpacity onPress={onPress} style={styles.navButtonRight}>
        <IconAlko name="map" size={20} color={Colors.snow} style={styles.icon} />
      </TouchableOpacity>
    );
  },

  brandTitle() {
    return (
      <IconAlko name="alko" size={20} color={Colors.snow} />
    );
  },

};
