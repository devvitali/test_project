import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppContainer from '../AppContainer';
import WaitingScreen from './WaitingScreen';
import NoDrinkUp from './NoDrinkUpScreen';
import { NavItems, DirectionDialog } from '../../components';
import { User } from '../../firebase/models';
import { DrinkupActions } from '../../redux';
import styles from './styles';

class JoinDrinkUp extends Component {

  static propTypes = {
    barId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDirectionDialogShowing: false,
    };
  }
  componentWillReceiveProps(newProps) {
    if (!newProps.bar) {
      this.props.navigation.goBack();
    }
  }
  onShowDirectionDialog = () => this.setState({ isDirectionDialogShowing: true });
  onCloseDirectionDialog = () => this.setState({ isDirectionDialogShowing: false });
  onGoBack = () => this.props.setDrinkupBar(null);
  getTitle() {
    if (this.props.bar) {
      return this.props.bar.name;
    }
    return 'Join DrinkUp';
  }
  getRightNavBarButton() {
    if (this.props.bar) {
      return NavItems.mapButton(this.onShowDirectionDialog);
    }
    return null;
  }
  renderScreen() {
    if (this.props.bar) {
      if (this.props.bar.currentDrinkUp) {
        return <WaitingScreen navigation={this.props.navigation} />;
      }
      const special = this.props.bar.currentSpecial;
      return <NoDrinkUp special={special} navigation={this.props.navigation} />;
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

const mapStateToProps = state => ({
  bar: state.drinkup.bar,
  isUserValid: User.isUserValid(state.auth.profile),
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getBar: barId => dispatch(DrinkupActions.barRequest(barId)),
  getUsers: barId => dispatch(DrinkupActions.usersRequest(barId)),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});


export default connect(mapStateToProps, mapDispatchToProps)(JoinDrinkUp);
