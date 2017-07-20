import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import * as Animation from 'react-native-animatable';
import { Button, Banner, AvatarList } from '../../components';
import { DrinkupActions } from '../../redux';
import { requestingMember } from '../../fixture/drinkupMembers';
import styles from './styles';

class WaitingScreen extends Component {
  static propTypes = {
    users: PropTypes.object,
    column: PropTypes.number,
    columnPadding: PropTypes.number,
    joined: PropTypes.bool,
    joinDrinkup: PropTypes.func,
  };
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
    if (!this.props.bar) {
      this.props.getBar(this.props.barId);
    } else if (this.props.bar.currentDrinkUp) {
      this.props.getDrinkup(this.props.bar.currentDrinkUp, this.props.uid);
    }
  }
  componentDidUpdate() {
    const { joined, bar, navigation, users, getDrinkup, uid } = this.props;
    console.log('waiting componentDidUpdate', this.props);
    if (joined) {
      navigation.navigate('DrinkUpScreen', { barId: bar.id });
    }
    if (bar && bar.currentDrinkUp && !users) {
      getDrinkup(bar.currentDrinkUp, uid);
    }
  }

  // this function is only use for demo
  onDraftJoined = () => this.props.joinDrinkup(requestingMember);
  onSendRequestDrinkup = () => {
    const { user, uid, bar } = this.props;
    const currentUser = { ...user, uid };
    this.props.sendRequestDrinkup(bar, currentUser);
  };
  onCancelRequest = () => {

  };
  render() {
    const { bar: { currentSpecial }, users, waitingInvite } = this.props;
    return (
      <View style={[styles.mainContainer, styles.container]}>
        {currentSpecial &&
        <Banner theme="info" text={I18n.t('Drinkup_JoinDrinkUpAndGet2For1Drinks')} onPress={this.onWaiting} />
        }
        <AvatarList users={users} iconOnly />
        {waitingInvite ? (
          <View>
            <Animation.View animation="fadeIn" delay={1000} duration={500}>
              <Button theme={'disallow'} onPress={this.onCancelRequest} text={I18n.t('Drinkup_CancelRequest')} />
            </Animation.View>
            <Text style={styles.waitingInviteText}>{I18n.t('Drinkup_WaitingInvite')}</Text>
          </View>
        ) : (
          <Button onPress={this.onSendRequestDrinkup} text={I18n.t('Drinkup_JoinDrinkUp')} />
        )}

      </View>
    );
  }
}

const mapStateToProps = state => ({
  joined: state.drinkup.joined,
  waitingInvite: state.drinkup.waitingInvite,
  users: state.drinkup.users,
  uid: state.auth.uid,
  user: state.auth.user,
  bar: state.drinkup.bar,
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getBar: barId => dispatch(DrinkupActions.barRequest(barId)),
  getDrinkup: (drinkupId, userId) => dispatch(DrinkupActions.drinkupRequest(drinkupId, userId)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingScreen);
