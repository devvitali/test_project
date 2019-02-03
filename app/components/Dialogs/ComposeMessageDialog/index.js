import React from 'react';
import { TextInput, Text, ListView, View, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';

import { Colors } from '../../../themes';
import Button from '../../Button';
import Dialog from '../';
import styles from './styles';

const previousMessages = [
  'Hey, we\'re in the back, to the left of the bar.',
  'Front table, wearing a pink hat.',
  'Sitting with the guy in the clown suit.',
  'Front table, wearing a pink hat.',
];
const ComposeMessageDialog = (props) => {
  const { onClose, visible, messagePlaceholder, onChangeMessage, message } = props;
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  return (
    <Dialog
      closeOnBackdropPress={false}
      onClose={onClose}
      visible={visible}
      dialogStyle={styles.dialog}
    >
      <TextInput
        multiline
        numberOfLines={4}
        placeholder={messagePlaceholder}
        style={styles.messageInput}
        onChangeText={onChangeMessage}
        value={message}
        selectionColor={Colors.brand.clear.orange}
        underlineColorAndroid={Colors.transparent}
      />
      <Button onPress={onClose} text={I18n.t('Drinkup_SendMessage')} />
      <Text style={styles.previousMessageText}>{I18n.t('Drinkup_SendPreviousMessage')}</Text>
      <ListView
        dataSource={ds.cloneWithRows(previousMessages)}
        renderRow={rowData => (
          <TouchableOpacity activeOpacity={0.6} onPress={() => onChangeMessage(rowData)}>
            <Text style={styles.previousMessage}>{rowData}</Text>
          </TouchableOpacity>
        )}
        renderSeparator={(sectionID, rowID) =>
          rowID < previousMessages.length - 1 &&
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        }
      />
    </Dialog>
  );
};
export default ComposeMessageDialog;
