import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, TouchableHighlight, TouchableOpacity } from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Styles from './styles';
import { Colors } from '../../themes';

function renderCloseButton(onPress) {
  return (
    <View style={Styles.closeButton}>
      <TouchableOpacity onPress={onPress}>
        <IconFontAwesome name="close" color={Colors.snow} size={16} style={Styles.closeIcon} />
      </TouchableOpacity>
    </View>
  );
}
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
      <View style={Styles.dialogContainer}>
        <View style={[Styles.contentContainer, props.dialogStyle]}>{props.children}</View>
        {props.closeButton && renderCloseButton(props.onClose)}
      </View>
      <View style={Styles.subcontentContainer}>
        {props.subcontent}
      </View>
    </View>
  </Modal>
);
Dialog.propTypes = {
  closeOnBackdropPress: PropTypes.bool,
  onClose: PropTypes.func,
  animationType: PropTypes.string,
  backdropColor: PropTypes.string,
  visible: PropTypes.bool,
  closeButton: PropTypes.bool,
  subcontent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  dialogStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
};
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