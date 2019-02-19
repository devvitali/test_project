import React from 'react';
import { TouchableOpacity, Keyboard } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import IconAlko from '../IconAlko';
import styles from './styles';
import { Colors } from '../../themes';

function openDrawer(navigation) {
  Keyboard.dismiss();
  navigation.dispatch(DrawerActions.openDrawer());
}

function goBack(navigation) {
  Keyboard.dismiss();
  navigation.goBack();
}

export default {

  backButton(navigation, onBack) {
    const onPress = () => {
      if (onBack) {
        onBack();
      }
      goBack(navigation);
    };

    return () => (
      <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Icon name="angle-left" size={35} color={Colors.snow} style={styles.backIcon} />
      </TouchableOpacity>
    );
  },

  hamburgerButton(navigation) {
    return () => (
      <TouchableOpacity onPress={() => openDrawer(navigation)} style={styles.navButtonLeft}>
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
