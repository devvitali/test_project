import React, { Component } from 'react';
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


export default class PicPhotoSourceDialog extends Component {

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onUseCameraPress: PropTypes.func,
    onUsePhotosPress: PropTypes.func,
  }

  onUsePhotosPress = () => {
    this.props.onClose();
    this.props.onUsePhotosPress();
  }

  onUseCameraPress = () => {
    this.props.onClose();
    this.props.onUseCameraPress();
  }

  render() {
    return (
      <Dialog
        closeButton
        closeOnBackdropPress
        onClose={this.props.onClose}
        visible={this.props.visible}
      >

        <Button
          text={I18n.t('Pic_UsePhotos')}
          style={styles.firstButton}
          onPress={this.onUsePhotosPress}
        />

        <Button
          text={I18n.t('Pic_UseCamera')}
          onPress={this.onUseCameraPress}
        />

      </Dialog>
    );
  }
}
