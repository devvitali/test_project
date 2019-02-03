import React, { Component } from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Button, Banner, AvatarList } from '../../components';
import { BarImages } from './BarImages';
import { isProfileComplete } from '../../utils/auth';
import { DrinkupActions } from '../../redux';
import styles from './styles';

class WaitingScreen extends Component {

  static defaultProps = {
    column: 3,
    columnPadding: 15,
  };

  state = {
    isDirectionDialogShowing: false,
    user: null,
    joiningUser: null,
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
  }

  onCancelRequest = () => {
    const { user, uid, draftBar } = this.props;
    const currentUser = { ...user, uid };
    this.props.cancelRequestDrinkup(draftBar, currentUser);
  }

  onWaitingBar = () => {
    this.props.initDrinkupBar(this.props.bar);
  }

  renderButton() {
    const { oldWaitingInvite, fetching, waitingInvite, bar } = this.props;

    if (waitingInvite) {
      return (
        <View>
          <Button
            showIndicator={this.props.fetching}
            theme="disallow"
            onPress={this.onCancelRequest}
            text={I18n.t('Drinkup_CancelRequest')}
          />
          <Text style={styles.waitingInviteText}>{I18n.t('Drinkup_WaitingInvite')}</Text>
        </View>
      );
    }

    if (oldWaitingInvite) {
      return (
        <Button
          onPress={this.onWaitingBar}
          theme="disallow"
          text={`waiting for invite at ${bar.name}`}
        />
      );
    }

    if (!fetching) {
      return (
        <Button
          showIndicator={this.props.fetching}
          onPress={this.onSendRequestDrinkup}
          text={I18n.t('Drinkup_JoinDrinkUp')}
        />
      );
    }

    return null;
  }

  render() {
    const { draftBar: { specialId, images }, users } = this.props;
    return (
      <View style={[styles.mainContainer]}>
        <BarImages images={images} />
        {specialId && (
          <View style={styles.bannerContainer}>
            <Banner
              showGradient
              theme="info"
              text={I18n.t('Drinkup_JoinDrinkUpAndGet2For1Drinks')}
              onPress={this.onSendRequestDrinkup}
            />
          </View>
        )}
        <View style={styles.container}>
          <AvatarList users={users} iconOnly />
          {this.renderButton()}
        </View>
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
  draftBar: state.drinkup.draftBar,
});

// eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  initDrinkupBar: bar => dispatch(DrinkupActions.initDrinkupBar(bar)),
  getDrinkup: (drinkupId, userId) => dispatch(DrinkupActions.drinkupRequest(drinkupId, userId)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
  cancelRequestDrinkup: (bar, user) => dispatch(DrinkupActions.cancelRequestDrinkup(bar, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingScreen);
