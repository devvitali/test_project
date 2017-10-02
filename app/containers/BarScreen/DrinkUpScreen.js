import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppContainer from '../AppContainer';
import { NavItems, DirectionDialog } from '../../components';
import styles from './styles';
import DrinkUpLobby from './DrinkUpLobbyScreen';
import { DrinkupActions } from '../../redux';

class DrinkUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
    };
  }
  componentDidMount() {
    let barId = this.props.barId;
    if (this.props.bar) {
      barId = this.props.bar.id;
      if (!this.props.users) {
        this.props.getUsers(this.props.bar.currentDrinkUp);
      }
    }
    if (barId) {
      this.props.getBar(barId);
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.joined !== newProps.joined && !newProps.joined) {
      this.props.setDrinkupBar(null);
      this.props.clearDrinkupUsers();
      // this.props.navigation.goBack();
    }
  }
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
      return <DrinkUpLobby navigation={this.props.navigation} />;
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
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getBar: barId => dispatch(DrinkupActions.barRequest(barId)),
  getUsers: drinkUpId => dispatch(DrinkupActions.drinkupRequest(drinkUpId)),
  clearDrinkupUsers: () => dispatch(DrinkupActions.clearDrinkupUsers()),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkUp);
