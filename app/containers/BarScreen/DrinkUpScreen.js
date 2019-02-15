import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AppContainer from '../AppContainer';
import { NavItems, DirectionDialog, DrinkUpLobby } from '../../components';
import styles from './styles';
import { DrinkupActions } from '../../redux';
import { firebaseAnalytics } from '../../firebase';
import { BarFactory } from '../../firebase/models';

class DrinkUpScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
    };
    this.barActions = {
      onUpdate: this.onUpdate,
    };
    this.barSubscribeModel = new BarFactory(this.barActions);
  }

  componentDidMount() {
    if (this.props.bar) {
      this.barSubscribeModel.subscribe(() => {}, this.props.bar.id);
      this.props.getDrinkup(this.props.bar.currentDrinkUp, this.props.uid);
      if (!this.props.users) {
        this.props.getUsers(this.props.bar.currentDrinkUp);
      }
    }

    firebaseAnalytics.setCurrentScreen('DrinkUp');
  }

  componentWillReceiveProps(newProps) {
    if (this.props.joined !== newProps.joined && !newProps.joined) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'JoinDrinkUpScreen' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      this.props.clearDrinkupUsers();
    }
  }

  componentWillUnmount() {
    this.barSubscribeModel.unsubscribe(this.props.bar.id);
  }

  onUpdate = (bar, id) => {
    this.props.updateDraftBar({ ...bar, id });
  };

  onShowDirectionDialog = () => this.setState({ isDirectionDialogShowing: true });

  onCloseDirectionDialog = () => this.setState({ isDirectionDialogShowing: false });

  getTitle() {
    if (this.props.bar) {
      return this.props.bar.name;
    }
    return 'DrinkUp';
  }

  getRightNavBarButton() {
    if (this.props.bar) {
      return NavItems.mapButton(this.onShowDirectionDialog);
    }
    return null;
  }

  renderScreen() {
    if (this.props.users && Object.keys(this.props.users).length > 0) {
      return <DrinkUpLobby {...this.props} />;
    }
    return null;
  }

  renderDirectionDialog() {
    return (
      <DirectionDialog
        bar={this.props.bar}
        onClose={this.onCloseDirectionDialog}
        onGoogleMapsPress={this.onCloseDirectionDialog}
        onAppleMapsPress={this.onCloseDirectionDialog}
        visible={this.state.isDirectionDialogShowing}
      />
    );
  }

  render() {
    return (
      <AppContainer
        title={this.getTitle()}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
        renderRightButton={this.getRightNavBarButton()}
      >
        <View style={styles.contentContainer}>
          {this.renderScreen()}
          {this.renderDirectionDialog()}
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  users: state.drinkup.users,
  bar: state.drinkup.bar,
  joined: state.drinkup.joined,
  uid: state.auth.uid,
  fetching: state.drinkup.fetching,
  waitingUsers: state.drinkup.waitingUsers,
  user: state.auth.profile,
  location: state.location,
});

const mapDispatchToProps = dispatch => ({
  getDrinkup: (drinkupId, userId) => dispatch(DrinkupActions.drinkupRequest(drinkupId, userId)),
  getUsers: drinkUpId => dispatch(DrinkupActions.drinkupRequest(drinkUpId)),
  clearDrinkupUsers: () => dispatch(DrinkupActions.clearDrinkupUsers()),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
  updateDraftBar: bar => dispatch(DrinkupActions.updateDraftBar(bar)),
  leaveDrinkup: (bar, user) => dispatch(DrinkupActions.leaveDrinkup(bar, user)),
  sendDrinkupInvitation: (bar, user, message) => dispatch(DrinkupActions.sendDrinkupInvitation(bar, user, message)),
  acceptDrinkupInvitation: (bar, uid) => dispatch(DrinkupActions.acceptDrinkupInvitation(bar, uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkUpScreen);
