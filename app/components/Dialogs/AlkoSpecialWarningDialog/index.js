import React from 'react';
import { Text } from 'react-native';
import I18n from 'react-native-i18n';

import Button from '../../Button';
import Dialog from '../';
import styles from './styles';

const AlkoSpecialWarningDialog = ({ onClose, onButtonPress, visible, expired }) => (
  <Dialog
    closeButton
    closeOnBackdropPress
    onClose={onClose}
    visible={visible}
  >
    <Text style={styles.title}>{I18n.t('Redeem_WarningTitle')}</Text>
    <Text style={styles.body}>{I18n.t(!expired ? 'Redeem_WarningBody' : 'Redeem_Expired')}</Text>
    {!expired && <Button onPress={onButtonPress} text={I18n.t('Redeem_WarningDismiss')} />}
  </Dialog>
);
export default AlkoSpecialWarningDialog;
