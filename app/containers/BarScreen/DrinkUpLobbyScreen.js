import React from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Button, Dialog, AlkoSpecialWarningDialog, JoinDialog, ComposeMessageDialog, Banner, AvatarList,
} from '../../components';
import { DrinkupActions } from '../../redux';
import { requestingMember } from '../../fixture/drinkupMembers';
import styles from './styles';

class DrinkupLobbyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      joiningUser: requestingMember,
      showRedeemWarning: false,
      showComposeMessage: false,
      composedMessage: '',
    };
  }
  componentDidUpdate() {
    if (!this.props.joined) {
      // NavigationActions.map();
    }
  }
  onShowMessage = user => this.setState({ user });
  onCloseMessage = () => this.setState({ user: null });
  onRedeem = () => {
    const firstTime = true;
    if (firstTime) {
      this.setState({ showRedeemWarning: true });
    } else {
      this.redeem();
    }
  };
  onLeave = () => {
    this.props.leaveDrinkup(requestingMember);
    this.setState({ waiting: false });
  };
  onCloseJoiningDialog = () => {
    this.setState({ joiningUser: null });
    this.setState({ showComposeMessage: true });
  };

  onCloseRedeemWarningDialog = () => this.setState({ showRedeemWarning: false });
  onCloseComposeMessageDialog = () => this.setState({ showComposeMessage: false });
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
    return (
      <ComposeMessageDialog
        message={this.state.composedMessage}
        messagePlaceholder={`How will ${requestingMember.firstName} find you?`}
        onChangeMessage={this.onComposedMessageChange}
        onClose={this.onCloseComposeMessageDialog}
        visible={this.state.showComposeMessage}
      />
    );
  }
  renderMessageDialog() {
    const { user } = this.state;
    if (!user) {
      return null;
    }
    return (
      <Dialog closeButton closeOnBackdropPress onClose={this.onCloseMessage} visible>
        <Text style={styles.name}>{user.firstName} {I18n.t('Drinkup_Says')}</Text>
        <Text style={styles.message}>{user.message}</Text>
      </Dialog>
    );
  }
  renderRequestToJoinDialog() {
    if (this.state.joiningUser) {
      const { firstName, distance, avatar } = this.state.joiningUser;
      return (
        <JoinDialog
          onClose={this.onCloseJoiningDialog}
          visible
          name={firstName}
          avatarSrc={avatar}
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
  joined: state.drinkup.joined,
  users: state.drinkup.users,
});

const mapDispatchToProps = dispatch => ({
  leaveDrinkup: user => dispatch(DrinkupActions.leaveDrinkup(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkupLobbyScreen);
