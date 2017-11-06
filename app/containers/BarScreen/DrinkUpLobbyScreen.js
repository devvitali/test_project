import React from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Button,
  Dialog,
  AlkoSpecialWarningDialog,
  JoinDialog,
  ComposeMessageDialog,
  Banner,
  AvatarList,
  CheersDialog,
} from '../../components';
import { BarImages } from './BarImages';
import { DrinkupActions } from '../../redux';
import styles from './styles';

class DrinkupLobbyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      invitedUser: null,
      showRedeemWarning: false,
      showComposeMessage: false,
      showCheerDialog: true,
      composedMessage: ' ',
    };
  }
  onCloseMessage = () => {
    const { bar, uid, acceptDrinkupInvitation } = this.props;
    this.setState({ showCheerDialog: false });
    acceptDrinkupInvitation(bar, uid);
  };
  onRedeem = () => {
    const firstTime = true;
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
  renderRedeemWarningDialog() {
    return (
      <AlkoSpecialWarningDialog
        onButtonPress={this.onAcceptRedeemWarning}
        onClose={this.onCloseRedeemWarningDialog}
        visible={this.state.showRedeemWarning}
      />
    );
  }
  renderComposeMessageDialog() {
    const { invitedUser, showComposeMessage, composedMessage } = this.state;
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
    return null;
  }
  renderCheerDialog() {
    const { uid, users } = this.props;
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
    return null;
  }
  renderRequestToJoinDialog() {
    const { waitingUsers } = this.props;
    if (waitingUsers && Object.keys(waitingUsers).length > 0) {
      if (this.state.showJoinDialog) {
        const user = waitingUsers[Object.keys(waitingUsers)[0]];
        const { firstName, distance = 0, photoURL } = user;
        return (
          <JoinDialog
            onClose={() => this.onCloseJoiningDialog(user)}
            visible
            name={firstName}
            avatarSrc={photoURL}
            distance={distance}
          />
        );
      }
      setTimeout(() => this.setState({ showJoinDialog: true }), 100);
    }
    return null;
  }
  render() {
    const { bar, users } = this.props;
    let special = null;
    if (bar) {
      special = bar.specialId;
    }
    return (
      <View style={[styles.mainContainer]}>
        <BarImages images={bar.images} />
        {special &&
        <View style={styles.bannerContainer}>
          <Banner
            onPress={this.onRedeem}
            theme="info"
            text={I18n.t('Drinkup_ClickToGet2For1ALKOSpecial')}
          />
        </View>
        }
        <View style={styles.container}>
          <AvatarList users={users} />
          <Button onPress={this.onLeave} theme="disallow" text={I18n.t('Drinkup_LeaveTheDrinkUp')} />
          {this.renderRequestToJoinDialog()}
          {this.renderRedeemWarningDialog()}
          {this.renderComposeMessageDialog()}
          {this.renderCheerDialog()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  bar: state.drinkup.bar,
  users: state.drinkup.users,
  waitingUsers: state.drinkup.waitingUsers,
  user: state.auth.profile,
  uid: state.auth.uid,
});

const mapDispatchToProps = dispatch => ({
  leaveDrinkup: (bar, user) => dispatch(DrinkupActions.leaveDrinkup(bar, user)),
  sendDrinkupInvitation: (bar, user, message) => dispatch(DrinkupActions.sendDrinkupInvitation(bar, user, message)),
  acceptDrinkupInvitation: (bar, uid) => dispatch(DrinkupActions.acceptDrinkupInvitation(bar, uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkupLobbyScreen);
