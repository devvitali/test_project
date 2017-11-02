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
    if (this.props.bar.currentDrinkUp) {
      this.props.getDrinkup(this.props.bar.currentDrinkUp, this.props.uid);
    }
    if (this.props.joined) {
      this.props.navigation.navigate('DrinkUpScreen', { barId: this.props.bar.id });
    }
  }
  componentWillReceiveProps(newProps) {
    if (!this.props.joined && newProps.joined) {
      console.log('Waiting screen navigate DrinkUpScreen');
      this.props.navigation.navigate('DrinkUpScreen', { barId: this.props.bar.id });
    }
  }
  componentDidUpdate() {
    const { bar, users, getDrinkup, uid } = this.props;
    if (bar && bar.currentDrinkUp && !users) {
      getDrinkup(bar.currentDrinkUp, uid);
    }
  }

  // this function is only use for demo
  onSendRequestDrinkup = () => {
    const { user, uid, bar } = this.props;
    const currentUser = { ...user, uid };
    if (isProfileComplete(user)) {
      this.props.sendRequestDrinkup(bar, currentUser);
    } else {
      this.props.navigation.navigate('CompleteProfileScene', {
        type: 'Join', bar,
      });
    }
  };
  onCancelRequest = () => {
    const { user, uid, bar } = this.props;
    const currentUser = { ...user, uid };
    this.props.cancelRequestDrinkup(bar, currentUser);
  };
  render() {
    const { bar: { specialId }, users, waitingInvite, fetching } = this.props;
    return (
      <View style={[styles.mainContainer, styles.container]}>
        {specialId &&
        <Banner theme="info" text={I18n.t('Drinkup_JoinDrinkUpAndGet2For1Drinks')} onPress={this.onWaiting} />
        }
        <AvatarList users={users} iconOnly />
        {waitingInvite ? (
          <View>
            <Button theme={'disallow'} onPress={this.onCancelRequest} text={I18n.t('Drinkup_CancelRequest')} />
            <Text style={styles.waitingInviteText}>{I18n.t('Drinkup_WaitingInvite')}</Text>
          </View>
        ) : (
          !fetching &&
          <Button onPress={this.onSendRequestDrinkup} text={I18n.t('Drinkup_JoinDrinkUp')} />
        )}
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
});

// eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getDrinkup: (drinkupId, userId) => dispatch(DrinkupActions.drinkupRequest(drinkupId, userId)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
  cancelRequestDrinkup: (bar, user) => dispatch(DrinkupActions.cancelRequestDrinkup(bar, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingScreen);
