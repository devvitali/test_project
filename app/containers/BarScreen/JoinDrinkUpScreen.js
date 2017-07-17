import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { User } from '../../firebase/models';
import NavItems from '../../components/NavigationBar/NavigationBarItems';
import styles from './styles';
import WaitingScreen from './WaitingScreen';
import NoDrinkUp from './NoDrinkUpScreen';
import DirectionsDialog from '../../components/Dialogs/DirectionDialog';
import DrinkupActions from '../../redux/drinkup';

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

  componentDidMount() {
    if (!this.props.isUserValid) {
      // NavigationActions.editProfile();
    } else {
      this.props.getBar(this.props.barId);
      // if (this.props.bar) {
      //   NavigationActions.refresh({
      //     title: this.props.bar.name,
      //     renderRightButton: NavItems.mapButton(this.showDirectionDialog),
      //   });
      // }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.bar) {
      // NavigationActions.refresh({
      //   title: this.props.bar.name,
      //   renderRightButton: NavItems.mapButton(this.showDirectionDialog),
      // });
    }
  }

  showDirectionDialog = () => {
    this.setState({ isDirectionDialogShowing: true });
  }

  closeDirectionDialog = () => {
    this.setState({ isDirectionDialogShowing: false });
  }

  renderScreen() {
    if (this.props.bar) {
      if (this.props.bar.currentDrinkUp) {
        return <WaitingScreen />;
      }

      const special = this.props.bar.currentSpecial;
      return <NoDrinkUp special={special} />;
    }

    return null;
  }

  renderDirectionDialog() {
    return (
      <DirectionsDialog
        bar={{
          name: 'Bohemian Biergarten',
          address: {
            city: 'Boulder',
            state: 'CO',
          },
        }}
        onClose={this.closeDirectionDialog}
        onGoogleMapsPress={this.closeDirectionDialog}
        onAppleMapsPress={this.closeDirectionDialog}
        visible={this.state.isDirectionDialogShowing}
      />
    );
  }

  render() {
    return (
      <View style={styles.contentContainer}>
        {this.renderScreen()}
        {this.renderDirectionDialog()}
      </View>
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
});


export default connect(mapStateToProps, mapDispatchToProps)(JoinDrinkUp);
