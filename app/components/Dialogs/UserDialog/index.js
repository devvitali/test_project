import React from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import { Avatar } from '../../Avatar';
import Dialog from '../index';
import styles from './styles';

export default class UserDialog extends React.Component {

  componentDidMount() {

  }

  render() {
    const { name, avatarSrc, message, onClose } = this.props;

    console.log('XAXAX', message);

    return (
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
        {message &&
          <View>
            <Text style={styles.message}>"{message.message}"</Text>
            <Text style={styles.time}>sent {moment(message.sentAt).fromNow()}</Text>
          </View>
        }
      </Dialog>
    );
  }

}
