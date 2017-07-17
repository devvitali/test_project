import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppContainer from '../AppContainer';
import NavItems from '../../components/NavigationBar/NavigationBarItems';
import styles from './styles';
import DrinkUpLobby from './DrinkUpLobbyScreen';
import ItsJustMe from './ItsJustMeScreen';
import DrinkupActions from '../../redux/drinkup';
import DirectionsDialog from '../../components/Dialogs/DirectionDialog';

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
  getTitle() {
    if (this.props.bar) {
      return this.props.bar.title;
    }
    return 'DrinkUp';
  }
  getRightNavBarButton() {
    if (this.props.bar) {
      return NavItems.mapButton(this.showDirectionDialog);
    }
  }
  showDirectionDialog = () => {
    this.setState({ isDirectionDialogShowing: true });
  }

  closeDirectionDialog = () => {
    this.setState({ isDirectionDialogShowing: false });
  }

  renderScreen() {
    if (!this.props.users) {
      return null;
    }

    if (this.props.users && Object.keys(this.props.users).length > 1) {
      return <DrinkUpLobby />;
    }

    return <ItsJustMe />;
  }

  renderDirectionDialog() {
    return (
      <DirectionsDialog
        bar={this.props.bar}
        onClose={this.closeDirectionDialog}
        onGoogleMapsPress={this.closeDirectionDialog}
        onAppleMapsPress={this.closeDirectionDialog}
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
