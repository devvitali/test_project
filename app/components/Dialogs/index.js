import React from 'react';
import { Modal, View, TouchableHighlight, TouchableOpacity } from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Styles from './styles';
import { Colors } from '../../themes';

const Dialog = props => (
  <Modal
    transparent
    animationType={props.animationType}
    visible={props.visible}
    onRequestClose={props.onClose}
  >
    <View style={Styles.modalContainer}>
      <TouchableHighlight
        underlayColor={props.backdropColor}
        style={[Styles.backdrop, { backgroundColor: props.backdropColor }]}
        onPress={props.closeOnBackdropPress ? props.onClose : null}
      >
        <View />
      </TouchableHighlight>
      <View style={[Styles.dialogContainer, props.dialogContainer]}>
        <View style={[Styles.contentContainer, props.dialogStyle]}>{props.children}</View>
        {props.closeButton && (
          <View style={Styles.closeButton}>
            <TouchableOpacity onPress={props.onClose}>
              <IconFontAwesome name="close" color={Colors.snow} size={16} style={Styles.closeIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={Styles.subcontentContainer}>
        {props.subcontent}
      </View>
    </View>
  </Modal>
);

Dialog.defaultProps = {
  onClose: () => {},
  closeOnBackdropPress: true,
  backdropColor: Colors.clearShadow,
  animationType: 'fade',
  visible: false,
};

export default Dialog;
export { default as AlkoSpecialWarningDialog } from './AlkoSpecialWarningDialog';
export { default as CheersDialog } from './CheersDialog';
export { default as ComposeMessageDialog } from './ComposeMessageDialog';
export { default as DirectionDialog } from './DirectionDialog';
export { default as JoinDialog } from './JoinDialog';
export { default as PicPhotoSourceDialog } from './PicPhotoSourceDialog';
export { default as UserDialog } from './UserDialog';
