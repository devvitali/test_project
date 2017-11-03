import React, { Component } from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import * as Animation from 'react-native-animatable';
import { Button, Banner, AvatarList } from '../../components';
import { isProfileComplete } from '../../utils/auth';
import { DrinkupActions } from '../../redux';
import { requestingMember } from '../../fixture/drinkupMembers';
import styles from './styles';

class WaitingScreen extends Component {
  static defaultProps = {
    column: 3,
    columnPadding: 15,
  };
  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
      user: null,
      joiningUser: requestingMember, // only use for demo
    };
  }
  componentDidMount() {
    if (this.props.draftBar.currentDrinkUp) {
      this.props.getDrinkup(this.props.draftBar.currentDrinkUp, this.props.uid);
    }
    if (this.props.joined) {
      this.props.navigation.navigate('DrinkUpScreen', { barId: this.props.draftBar.id });
    }
  }
  componentWillReceiveProps(newProps) {
    if (!this.props.joined && newProps.joined) {
      console.log('Waiting screen navigate DrinkUpScreen');
      this.props.navigation.navigate('DrinkUpScreen', { barId: this.props.draftBar.id });
    }
  }
  componentDidUpdate() {
    const { draftBar, users, getDrinkup, uid } = this.props;
    if (draftBar && draftBar.currentDrinkUp && !users) {
      getDrinkup(draftBar.currentDrinkUp, uid);
    }
  }

  // this function is only use for demo
  onSendRequestDrinkup = () => {
    const { user, uid, draftBar } = this.props;
    const currentUser = { ...user, uid };
    if (isProfileComplete(user)) {
      this.props.sendRequestDrinkup(draftBar, currentUser);
    } else {
      this.props.navigation.navigate('CompleteProfileScene', {
        type: 'Join', draftBar,
      });
    }
  };
  onCancelRequest = () => {
    const { user, uid, draftBar } = this.props;
    const currentUser = { ...user, uid };
    this.props.cancelRequestDrinkup(draftBar, currentUser);
  };
  onWaitingBar = () => {
    this.props.initDrinkupBar(this.props.bar);
  };
  renderButton() {
    const { oldWaitingInvite, fetching, waitingInvite, bar } = this.props;
    if (waitingInvite) {
      return (
        <View>
          <Button theme={'disallow'} onPress={this.onCancelRequest} text={I18n.t('Drinkup_CancelRequest')} />
          <Text style={styles.waitingInviteText}>{I18n.t('Drinkup_WaitingInvite')}</Text>
        </View>
      );
    }
    if (oldWaitingInvite) {
      return (
        <Button onPress={this.onWaitingBar} theme="disallow" text={`waiting for invite at ${bar.name}`} />
      );
    }
    if (!fetching) {
      return (
        <Button onPress={this.onSendRequestDrinkup} text={I18n.t('Drinkup_JoinDrinkUp')} />
      );
    }
  }
  render() {
    const { draftBar: { specialId }, users } = this.props;
    return (
      <View style={[styles.mainContainer, styles.container]}>
        {specialId &&
        <Banner theme="info" text={I18n.t('Drinkup_JoinDrinkUpAndGet2For1Drinks')} onPress={this.onWaiting} />
        }
        <AvatarList users={users} iconOnly />
        {this.renderButton()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.drinkup.fetching,
  joined: state.drinkup.joined,
  waitingInvite: state.drinkup.waitingInvite,
  users: state.drinkup.users,
  uid: state.auth.uid,
  user: state.auth.profile,
  bar: state.drinkup.bar,
  draftBar: state.drinkup.draftBar
});

// eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  initDrinkupBar: bar => dispatch(DrinkupActions.initDrinkupBar(bar)),
  getDrinkup: (drinkupId, userId) => dispatch(DrinkupActions.drinkupRequest(drinkupId, userId)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
  cancelRequestDrinkup: (bar, user) => dispatch(DrinkupActions.cancelRequestDrinkup(bar, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingScreen);
