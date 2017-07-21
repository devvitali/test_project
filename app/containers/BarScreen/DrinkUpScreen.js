import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppContainer from '../AppContainer';
import { NavItems, DirectionDialog } from '../../components';
import styles from './styles';
import DrinkUpLobby from './DrinkUpLobbyScreen';
import ItsJustMe from './ItsJustMeScreen';
import { DrinkupActions } from '../../redux';

class DrinkUp extends Component {
  static propTypes = {
    barId: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
    };
  }
  componentDidMount() {
    if (this.props.bar) {
      const barId = this.props.barId ? this.props.barId : this.props.bar.id;
      this.props.getBar(barId);
      if (!this.props.users) {
        this.props.getUsers(this.props.bar.currentDrinkUp);
      }
    }
  }
  componentWillUnmount() {
    this.props.clearDrinkupUsers();
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
    if (!this.props.users) {
      return null;
    }
    if (this.props.users && Object.keys(this.props.users).length > 0) {
      return <DrinkUpLobby />;
    }
    return <ItsJustMe navigation={this.props.navigation} />;
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
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getBar: barId => dispatch(DrinkupActions.barRequest(barId)),
  getUsers: drinkUpId => dispatch(DrinkupActions.drinkupRequest(drinkUpId)),
  clearDrinkupUsers: () => dispatch(DrinkupActions.clearDrinkupUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkUp);
