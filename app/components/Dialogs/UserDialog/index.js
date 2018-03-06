import React from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import { Avatar } from '../../Avatar';
import Dialog from '../index';
import styles from './styles';

const UserDialog = ({ name, avatarSrc, message, onClose, joinTime }) => (
  <Dialog
    visible
    closeButton
    dialogContainer={styles.dialogContainer}
    dialogStyle={styles.dialogStyle}
    onClose={onClose}
  >
    <Text style={styles.title}>{name}</Text>
    <Avatar
      style={styles.avatar}
      image={{ uri: avatarSrc }}
      imageStyle={styles.avatarImage}
      width={256}
    />
    {message && message.length > 0 &&
      <View>
        <Text style={styles.message}>"{message}"</Text>
        <Text style={styles.time}>sent at {moment(joinTime).format('H:ma')}</Text>
      </View>
    }
  </Dialog>
);
UserDialog.defaultProps = {
  message: 'test',
  joinTime: new Date(),
};

export default UserDialog;
