import React from 'react';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import {
  Button,
  UserDialog,
  AlkoSpecialWarningDialog,
  JoinDialog,
  ComposeMessageDialog,
  Banner,
  AvatarList,
  CheersDialog,
} from '../index';
import { BarImages } from '../../containers/BarScreen/BarImages';
import styles from '../../containers/BarScreen/styles';

export default class DrinkupLobbyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      invitedUser: null,
      showRedeemWarning: false,
      showComposeMessage: false,
      showCheerDialog: true,
      showUserDialog: false,
      composedMessage: ' ',
    };
  }
  onCloseMessage = () => {
    const { bar, uid, acceptDrinkupInvitation } = this.props;
    this.setState({ showCheerDialog: false });
    acceptDrinkupInvitation(bar, uid);
  };
  onRedeem = () => {
    if (firstTime) {
      this.setState({ showRedeemWarning: true });
    } else {
      this.redeem();
    }
  };
  onLeave = () => {
    const { bar, user, uid, leaveDrinkup } = this.props;
    leaveDrinkup(bar, { ...user, uid });
  };
  onCloseJoiningDialog = (invitedUser) => {
    this.setState({
      showComposeMessage: true,
      showJoinDialog: false,
      invitedUser,
    });
  };
  onCloseRedeemWarningDialog = () => this.setState({ showRedeemWarning: false });
  onComposedMessageChange = composedMessage => this.setState({ composedMessage });
  onShowUserImage = user => this.setState({ showUserDialog: true, user });
  onCloseComposeMessageDialog = () => {
    const { composedMessage, invitedUser } = this.state;
    this.setState({ showComposeMessage: false, invitedUser: null });
    invitedUser.invitedBy = this.props.user.firstName;
    invitedUser.message = composedMessage;
    this.props.sendDrinkupInvitation(this.props.bar, invitedUser);
  };
  onAcceptRedeemWarning = () => {
    this.setState({ showRedeemWarning: false });
    this.redeem();
  };
  redeem() {
    this.props.navigation.navigate('Redeem2For1Screen', {
      bar: this.props.bar.name,
      redeemDate: moment(),
      expiryDate: moment().add(3, 'minutes'),
    });
  }
  renderDialogs() {
    const { invitedUser, showComposeMessage, composedMessage, showUserDialog, user } = this.state;
    const { uid, users, waitingUsers, location } = this.props;
    if (invitedUser && showComposeMessage) {
      return (
        <ComposeMessageDialog
          message={composedMessage}
          messagePlaceholder={`How will ${invitedUser.firstName} find you?`}
          onChangeMessage={this.onComposedMessageChange}
          onClose={this.onCloseComposeMessageDialog}
          visible={showComposeMessage}
        />
      );
    }
    if (users[uid] && users[uid].invitedBy && !users[uid].messagesRead) {
      const { invitedBy, message } = users[uid];
      return (
        <CheersDialog
          onClose={this.onCloseMessage}
          visible={this.state.showCheerDialog}
          invitedBy={invitedBy}
          message={message}
        />
      );
    }
    if (showUserDialog) {
      return (
        <UserDialog
          onClose={() => this.setState({ showUserDialog: false, user: null })}
          visible
          message={user.message}
          name={user.firstName}
          avatarSrc={user.photoURL}
        />
      );
    }
    if (waitingUsers && Object.keys(waitingUsers).length > 0) {
      if (this.state.showJoinDialog) {
        const user = waitingUsers[Object.keys(waitingUsers)[0]];
        const { firstName, photoURL, uid } = user;
        return (
          <JoinDialog
            onClose={() => this.onCloseJoiningDialog(user)}
            visible
            uid={uid}
            name={firstName}
            avatarSrc={photoURL}
            location={location.coords}
          />
        );
      }
      setTimeout(() => this.setState({ showJoinDialog: true }), 100);
    }
    return (
      <AlkoSpecialWarningDialog
        onButtonPress={this.onAcceptRedeemWarning}
        onClose={this.onCloseRedeemWarningDialog}
        visible={this.state.showRedeemWarning}
      />
    );
  }
  render() {
    const { bar, users } = this.props;
    let special = null;
    if (bar) {
      special = bar.specialId;
      console.log('drinkup lobby bar', bar);
    }
    const userCount = Object.keys(users).length;
    return (
      <View style={[styles.mainContainer]}>
        <BarImages images={bar.images} />
        {special &&
        <View style={styles.bannerContainer}>
          <Banner
            onPress={userCount > 1 ? this.onRedeem : null}
            theme="info"
            text={userCount > 1 ? I18n.t('Drinkup_ClickToGet2For1ALKOSpecial') : I18n.t('Drinkup_Need2UsersForALKOSpecial')}
          />
        </View>
        }
        <View style={styles.container}>
          <AvatarList
            users={users}
            onShowUserImage={this.onShowUserImage}
          />
          <Button
            showIndicator={this.props.fetching}
            onPress={this.onLeave}
            theme="disallow"
            text={I18n.t('Drinkup_LeaveTheDrinkUp')}
          />
          {this.renderDialogs()}
        </View>
      </View>
    );
  }
}

