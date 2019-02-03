import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { View, ListView, Dimensions } from 'react-native';

import { Metrics, DrinkIcons } from '../../themes';
import styles from './styles';
import { Avatar } from '../index';

const { width } = Dimensions.get('window');

class AvatarList extends Component {

  static defaultProps = {
    columns: 3,
    columnPadding: 15,
  }

  render() {
    const { uid, users, columns, columnPadding, style, iconOnly, onShowUserImage } = this.props;

    const avatarWidth = ((width - (Metrics.doubleBaseMargin * 2)) / columns) - (columnPadding * 2);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    if (!users) {
      return null;
    }

    const sortedArray = Object.keys(users).map(id => Object.assign(users[id], { id }));
    sortedArray.sort((user1, user2) => user1.joinedAt - user2.joinedAt);

    return (
      <ListView
        enableEmptySections
        contentContainerStyle={[styles.list, style]}
        dataSource={ds.cloneWithRows(sortedArray)}
        renderRow={user => (
          <View
            style={[styles.avatarContainer, { padding: columnPadding }]}
          >
            {(user.photoURL && !iconOnly) ? (
              <Avatar
                image={{ uri: user.photoURL }}
                width={avatarWidth}
                height={avatarWidth - 15}
                name={user.firstName}
                message={_.get(users, `${uid}.messages.${user.id}`)}
                onPress={() => onShowUserImage(user)}
              />
            ) : (
              <Avatar
                image={DrinkIcons[user.icon]}
                width={avatarWidth}
                height={avatarWidth - 15}
                name={user.firstName}
              />
            )}
          </View>
        )}
      />
    );
  }

}

const mapStateToProps = state => ({
  uid: state.auth.uid,
});

export default connect(mapStateToProps)(AvatarList);
