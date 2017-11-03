import React from 'react';
import { View, ListView, Dimensions } from 'react-native';

import { Metrics, DrinkIcons } from '../../themes';
import styles from './styles';
import { Avatar } from '../';

const { width } = Dimensions.get('window');

export const AvatarList = ({ users, columns, columnPadding, style, iconOnly, onShowMessage }) => {
  const avatarWidth = ((width - (Metrics.doubleBaseMargin * 2)) / columns) - (columnPadding * 2);
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  // if (users) {
  //   users.test = users[Object.keys(users)[0]];
  //   users.test1 = users[Object.keys(users)[0]];
  //   users.test2 = users[Object.keys(users)[0]];
  //   users.test3 = users[Object.keys(users)[0]];
  //   users.test11 = users[Object.keys(users)[0]];
  //   users.test12 = users[Object.keys(users)[0]];
  //   users.test13 = users[Object.keys(users)[0]];
  //   users.t14 = users[Object.keys(users)[0]];
  // }
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
