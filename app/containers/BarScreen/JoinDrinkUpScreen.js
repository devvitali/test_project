import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import AppContainer from '../AppContainer';
import WaitingScreen from './WaitingScreen';
import NoDrinkUp from './NoDrinkUpScreen';
import { NavItems, DirectionDialog } from '../../components';
import { isUserValid } from '../../utils/auth';
import { DrinkupActions } from '../../redux';
import styles from './styles';

class JoinDrinkUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
    };
  }
  onShowDirectionDialog = () => this.setState({ isDirectionDialogShowing: true });
  onCloseDirectionDialog = () => this.setState({ isDirectionDialogShowing: false });
  onGoBack = () => {
    this.props.navigation.navigate('MapScreen');
  };
  getTitle() {
    if (this.props.draftBar) {
      return this.props.draftBar.name;
    }
    return 'Join DrinkUp';
  }
  getRightNavBarButton() {
    if (this.props.draftBar) {
      return NavItems.mapButton(this.onShowDirectionDialog);
    }
    return null;
  }
  renderScreen() {
    const { draftBar, bar, waitingInvite, navigation } = this.props;
    if (draftBar) {
      if (draftBar.currentDrinkUp) {
        if (!waitingInvite || bar.id === draftBar.id) {
          return (
            <WaitingScreen navigation={navigation} oldWaitingInvite={waitingInvite} />
          );
        }
      }
      const special = draftBar.specialId;
      return (
        <NoDrinkUp special={special} navigation={navigation} waitingInvite={waitingInvite} />
      );
    }
    return null;
  }

  renderDirectionDialog() {
    return (
      <DirectionDialog
        bar={{
          name: 'Bohemian Biergarten',
          address: {
            city: 'Boulder',
            state: 'CO',
          },
        }}
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
        renderLeftButton={NavItems.backButton(this.props.navigation, this.onGoBack)}
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

const auth$ = state => state.auth;
const drinkupBar$ = state => state.drinkup;
const selector = createSelector(auth$, drinkupBar$, (auth, drinkup) => ({
  bar: drinkup.bar,
  draftBar: drinkup.draftBar,
  waitingInvite: drinkup.waitingInvite,
  isUserValid: isUserValid(auth.profile),
}));

const mapStateToProps = state => ({
  ...selector(state),
});

// eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getUsers: barId => dispatch(DrinkupActions.usersRequest(barId)),
});


export default connect(mapStateToProps, mapDispatchToProps)(JoinDrinkUp);
