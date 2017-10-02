import React from 'react';
import { Text, Image, View } from 'react-native';
import I18n from 'react-native-i18n';

import Button from '../../Button';
import Dialog from '../';
import styles from './styles';
import { Images } from '../../../themes';

const CheersDialog = ({ onClose, visible }) => (
  <Dialog closeButton closeOnBackdropPress onClose={onClose} visible={visible}>
    <Text style={styles.title}>{I18n.t('Drinkup_AcceptedInviteMessage')}</Text>
    <View style={styles.imageWrapper}>
      <Image style={styles.image} resizeMode="contain" source={Images.cheers_static} />
    </View>
    {/* Image shown after gif animation stops */}
    <View style={styles.overlay}>
      <Image style={styles.image} resizeMode="contain" source={Images.cheers} />
    </View>
    <Button text={I18n.t('Drinkup_MeetNewPeople')} onPress={onClose} />
  </Dialog>
);
export default CheersDialog;
