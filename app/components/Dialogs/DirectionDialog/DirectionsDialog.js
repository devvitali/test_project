import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import I18n from 'react-native-i18n';

import Button from '../../Button';
import Dialog from '../';
import styles from './styles';

export const DirectionsDialog = ({ onClose, visible, openGoogleMaps, openAppleMaps }) => (
  <Dialog closeButton closeOnBackdropPress onClose={onClose} visible={visible}>
    <Text style={styles.title}>{I18n.t('Drinkup_NeedDirection')}</Text>
    <Button style={styles.button} onPress={openGoogleMaps} text={I18n.t('Drinkup_GoogleMap')} />
    <Button style={styles.button} onPress={openAppleMaps} text={I18n.t('Drinkup_AppleMap')} />
  </Dialog>
);
DirectionsDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  openGoogleMaps: PropTypes.func.isRequired,
  openAppleMaps: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
