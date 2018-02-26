import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CachedImage } from 'react-native-cached-image';
import IconAlko from '../IconAlko';
import { Metrics, Colors } from '../../themes';
import styles from './styles';

function renderIcon(props) {
  const { width, disabled, icon } = props;
  return (
    <View style={[styles.innerContainer, styles.iconContainer, { width, height: width }]}>
      <IconAlko name={icon} size={45} color={disabled ? Colors.brand.gray : Colors.snow} />
    </View>
  );
}

function renderImage(props) {
  const { width, message, disabled, imageStyle, messagesRead } = props;
  return (
    <View style={[styles.innerContainer, { width }]}>
      <CachedImage source={props.image} style={[styles.image, imageStyle, { width, height: width }]} />
      {
        message &&
        <View style={styles.btnMessage}>
          <Icon name="envelope"
            size={Metrics.icons.small}
            color={Colors.snow}
            style={{ opacity: messagesRead ? 0.8 : 1 }}
          />
        </View>
      }
      {disabled && <View style={styles.imageBackdrop} />}
    </View>
  );
}

function onAvatarPress(props) {
  const { message, name, image, onPress } = props;
  if (onPress) {
    onPress({ message, name, image });
  }
}
function renderAvatar(props) {
  const { image, name, width, style, disabled } = props;
  return (
    <View style={[{ width }, style]}>
      {image ? renderImage(props) : renderIcon(props)}
      {name && <Text style={[styles.name, disabled && styles.nameDisabled]}>{name}</Text>}
    </View>
  );
}
export const Avatar = props => (props.onPress ?
  <TouchableOpacity activeOpacity={0.7} onPress={() => onAvatarPress(props)}>
    {renderAvatar(props)}
  </TouchableOpacity> :
  renderAvatar(props)
);

Avatar.defaultProps = {
  width: 100,
  height: 100,
};
