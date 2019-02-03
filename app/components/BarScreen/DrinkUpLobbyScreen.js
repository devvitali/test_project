import React from 'react';
import _ from 'lodash';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
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
import { SpecialRedemption } from '../../firebase/models';
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
      showWarningDialog: false,
      composedMessage: ' ',
    };
  }

  onCloseMessage = () => {
    const { bar, uid, acceptDrinkupInvitation } = this.props;
    this.setState({ showCheerDialog: false });
    acceptDrinkupInvitation(bar, uid);
  }

  onRedeem = async () => {
    const { bar, uid } = this.props;
    const special = await SpecialRedemption.getByBarAndUser(bar.id, uid);

    const showSpecial = !special || !SpecialRedemption.hasExpired(special.timestamp);

    if (showSpecial) {
      if (!special) {
        this.setState({ showRedeemWarning: true });
      } else {
        this.redeem();
      }
    } else {
      this.setState({ showWarningDialog: true });
    }
  }

  onLeave = () => {
    const { bar, user, uid, leaveDrinkup } = this.props;
    leaveDrinkup(bar, { ...user, uid });
  }

  onCloseJoiningDialog = (invitedUser) => {
    this.setState({
      showComposeMessage: true,
      showJoinDialog: false,
      invitedUser,
    });
  }

  onCloseRedeemWarningDialog = () => this.setState({ showRedeemWarning: false })

  onComposedMessageChange = composedMessage => this.setState({ composedMessage })

  onShowUserImage = user => this.setState({ showUserDialog: true, user })

  onCloseComposeMessageDialog = () => {
    const { uid } = this.props;
    const { composedMessage, invitedUser } = this.state;
    this.setState({ showComposeMessage: false, invitedUser: null });

    invitedUser.invitedBy = uid;
    invitedUser.messages = {
      [uid]: {
        message: composedMessage,
        sentAt: (new Date()).getTime(),
      },
    };

    this.props.sendDrinkupInvitation(this.props.bar, invitedUser);
  }

  onAcceptRedeemWarning = async () => {
    this.setState({ showRedeemWarning: false });
    const startDate = new Date();
    await this.redeem(startDate.getTime(), true);
  }

  redeem = async () => {
    this.props.navigation.navigate('Redeem2For1Screen');
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

    if (users[uid] && users[uid].invitedBy) {
      const readAt = _.get(users, `${uid}.messages.${users[uid].invitedBy}.readAt`);
      if (!readAt) {
        const { invitedBy, messages } = users[uid];
        return (
          <CheersDialog
            onClose={this.onCloseMessage}
            visible={this.state.showCheerDialog}
            invitedBy={users[invitedBy].firstName}
            message={messages[invitedBy].message}
          />
        );
      }
    }

    if (showUserDialog) {
      return (
        <UserDialog
          onClose={() => this.setState({ showUserDialog: false, user: null })}
          visible
          message={_.get(users, `${uid}.messages.${user.uid}`)}
          name={user.firstName}
          avatarSrc={user.photoURL}
        />
      );
    }

    if (waitingUsers && Object.keys(waitingUsers).length > 0) {
      if (this.state.showJoinDialog) {
        const waitingUser = waitingUsers[Object.keys(waitingUsers)[0]];
        const { firstName, photoURL, uid: userId } = waitingUser;
        return (
          <JoinDialog
            onClose={() => this.onCloseJoiningDialog(waitingUser)}
            visible
            uid={userId}
            name={firstName}
            avatarSrc={photoURL}
            location={location.coords}
          />
        );
      }
      setTimeout(() => this.setState({ showJoinDialog: true }), 100);
    }

    if (this.state.showWarningDialog) {
      return (
        <AlkoSpecialWarningDialog
          onButtonPress={() => this.setState({ showWarningDialog: false })}
          onClose={() => this.setState({ showWarningDialog: false })}
          visible={this.state.showWarningDialog}
          expired
        />
      );
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

    const userCount = Object.keys(users).length;

    return (
      <View style={[styles.mainContainer]}>
        <BarImages images={bar.images} />

        {_.get(bar, 'specialId') && (
          <View style={styles.bannerContainer}>
            <Banner
              onPress={userCount > 1 ? this.onRedeem : null}
              theme="info"
              text={userCount > 1 ? I18n.t('Drinkup_ClickToGet2For1ALKOSpecial') : I18n.t('Drinkup_Need2UsersForALKOSpecial')}
            />
          </View>
        )}

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
