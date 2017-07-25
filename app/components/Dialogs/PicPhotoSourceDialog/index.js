import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import { Metrics } from '../../../themes';
import Button from '../../Button';
import Dialog from '../';

const styles = StyleSheet.create({
  firstButton: {
    marginBottom: Metrics.doubleBaseMargin,
  },
});

const PicPhotoSourceDialog = ({ onClose, visible, onUsePhotosPress, onUseCameraPress }) => (
  <Dialog closeButton closeOnBackdropPress onClose={onClose} visible={visible}>
    <Button
      text={I18n.t('Pic_UsePhotos')}
      style={styles.firstButton}
      onPress={() => { onClose(); onUsePhotosPress(); }}
    />
    <Button
      text={I18n.t('Pic_UseCamera')}
      onPress={() => { onClose(); onUseCameraPress(); }}
    />
  </Dialog>
);

PicPhotoSourceDialog.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onUseCameraPress: PropTypes.func,
  onUsePhotosPress: PropTypes.func,
};
export default PicPhotoSourceDialog;

