import React from 'react';
import { Text } from 'react-native';

import { Avatar } from '../../Avatar';
import Dialog from '../index';
import styles from './styles';

const JoinDialog = ({ name, avatarSrc, message, onClose }) => (
  <Dialog
    visible
    closeButton
    onClose={onClose}
  >
    <Text style={styles.title}>{name}</Text>
    <Avatar
      style={styles.avatar}
      image={{ uri: avatarSrc }}
      imageStyle={styles.avatarImage}
      width={128}
    />
    <Text style={styles.message}>{message}</Text>
  </Dialog>
);
export default JoinDialog;
