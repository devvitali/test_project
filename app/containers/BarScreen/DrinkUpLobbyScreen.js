import React from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Button, Dialog, AlkoSpecialWarningDialog, JoinDialog, ComposeMessageDialog, Banner, AvatarList,
} from '../../components';
import { DrinkupActions } from '../../redux';
import styles from './styles';

class DrinkupLobbyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      invitedUser: null,
      showJoinDialog: true,
      showRedeemWarning: false,
      showComposeMessage: false,
      composedMessage: '',
    };
  }
  onCloseMessage = () => {
    const { bar, uid } = this.props;
    this.props.acceptInvitation(bar, uid);
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
    const { bar, user, uid } = this.props;
    this.props.leaveDrinkup(bar, { ...user, uid });
  };
  onCloseJoiningDialog = (invitedUser) => {
    this.setState({
      showJoinDialog: false,
      showComposeMessage: true,
      invitedUser,
    });
  };

  onCloseRedeemWarningDialog = () => this.setState({ showRedeemWarning: false });
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
  onComposedMessageChange = composedMessage => this.setState({ composedMessage });
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
  renderMessageDialog() {
    const { uid, users } = this.props;
    if (users[uid] && users[uid].invitedBy && !users[uid].invitationChecked) {
      return (
        <Dialog closeButton closeOnBackdropPress onClose={this.onCloseMessage} visible>
          <Text style={styles.name}>{users[uid].invitedBy} {I18n.t('Drinkup_Says')}</Text>
          <Text style={styles.message}>{users[uid].message}</Text>
        </Dialog>
      );
    }
    return null;
  }
  renderRequestToJoinDialog() {
    const { waitingUsers } = this.props;
    if (this.state.showJoinDialog && waitingUsers && Object.keys(waitingUsers).length > 0) {
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
    return null;
  }
  render() {
    const { bar, users } = this.props;
    const special = bar.currentSpecial;
    return (
      <View style={[styles.mainContainer, styles.container]}>
        {special &&
          <Banner
            onPress={this.onRedeem}
            theme="info"
            text={I18n.t('Drinkup_ClickToGet2For1ALKOSpecial')}
          />
        }
        <AvatarList users={users} />
        <Button onPress={this.onLeave} theme="disallow" text={I18n.t('Drinkup_LeaveTheDrinkUp')} />
        {this.renderMessageDialog()}
        {this.renderRequestToJoinDialog()}
        {this.renderRedeemWarningDialog()}
        {this.renderComposeMessageDialog()}
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
  acceptInvitation: (bar, uid) => dispatch(DrinkupActions.acceptDrinkupInvitation(bar, uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkupLobbyScreen);
