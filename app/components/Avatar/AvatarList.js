import React from 'react';
import { View, ListView, Dimensions } from 'react-native';

import { Metrics } from '../../themes';
import styles from './styles';
import { Avatar } from '../';

const { width } = Dimensions.get('window');

export const AvatarList = ({ users, columns, columnPadding, style, iconOnly, onShowMessage }) => {
  const avatarWidth = ((width - (Metrics.doubleBaseMargin * 2)) / columns) - (columnPadding * 2);
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  if (!users) {
    return null;
  }
  return (
    <ListView
      enableEmptySections
      contentContainerStyle={[styles.list, style]}
      dataSource={ds.cloneWithRows(users)}
      renderRow={user => (
        <View style={[styles.avatarContainer, { padding: columnPadding }]}>
          {(user.photoURL && !iconOnly) ? (
            <Avatar
              image={{ uri: user.photoURL }}
              width={avatarWidth}
              height={avatarWidth - 15}
              name={user.firstName}
              message={user.message}
              messagesRead={user.messagesRead}
              onPress={user.message && onShowMessage}
              disabled={!user.arrived_at}
            />
          ) : (
            <Avatar icon={user.icon} width={avatarWidth} disabled={!user.arrived} name={user.firstName} />
          )}
        </View>
      )}
    />
  );
};
AvatarList.defaultProps = {
  columns: 3,
  columnPadding: 15,
};
