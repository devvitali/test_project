import React from 'react';
import { View, ListView, Dimensions } from 'react-native';

import { Metrics, DrinkIcons } from '../../themes';
import styles from './styles';
import { Avatar } from '../index';

const { width } = Dimensions.get('window');

export const AvatarList = ({ users, columns, columnPadding, style, iconOnly, onShowUserImage }) => {
  const avatarWidth = ((width - (Metrics.doubleBaseMargin * 2)) / columns) - (columnPadding * 2);
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  if (!users) {
    return null;
  }
  let sortedArray = Object.keys(users).map(key => users[key]);
  sortedArray.sort((user1, user2) => user1.joinTime - user2.joinTime);
  return (
    <ListView
      enableEmptySections
      contentContainerStyle={[styles.list, style]}
      dataSource={ds.cloneWithRows(sortedArray)}
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
              onPress={() => onShowUserImage(user)}
            />
          ) : (
            <Avatar image={DrinkIcons[user.icon]} width={avatarWidth} height={avatarWidth - 15} name={user.firstName} />
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
