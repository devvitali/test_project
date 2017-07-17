// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';

import IconAlko from '../IconAlko';

import styles from './styles';
import { Metrics, Colors } from '../../themes';

function getIconFamilyComponent(iconFamily) {
  let Icon = null;
  switch (iconFamily) {
    case 'material':
      Icon = IconMaterial;
      break;
    case 'fontawesome':
      Icon = IconFontAwesome;
      break;
    case 'alko':
      Icon = IconAlko;
      break;
    default:
      Icon = IconMaterial;
  }
  return Icon;
}

const DrawerButton = (props) => {
  const { text, isActive, onPress, iconName, iconSize, iconColor, iconFamily } = props;
  const Icon = getIconFamilyComponent(iconFamily);
  const containerStyle = [styles.btnDrawer, isActive ? styles.btnDrawerActive : null];
  const textStyle = [styles.btnDrawerText, isActive ? styles.btnDrawerTextActive : null];
  const iconStyle = [styles.btnDrawerIcon, isActive ? styles.btnDrawerIconActive : null];
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} >
      <View style={styles.titleContainer}>
        {iconFamily &&
        <Icon name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        }
        <Text style={textStyle}>{text}</Text>
      </View>
      <IconMaterial name="keyboard-arrow-right" size={Metrics.icons.medium} style={iconStyle} />
    </TouchableOpacity>
  );
};
DrawerButton.propTypes = {
  iconFamily: PropTypes.oneOf(['material', 'fontawesome', 'alko']),
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

DrawerButton.defaultProps = {
  iconSize: 20,
  iconColor: Colors.snow,
};

export default DrawerButton;
