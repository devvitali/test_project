import React, { Component } from 'react';
import { View } from 'react-native';
import { User } from '../../firebase/models/index';
import { Connect } from '../../redux/index';

class SplashScreen extends Component {
  componentDidMount() {
    this.props.actions.startBackgroundGeolocation();
  }

  componentDidUpdate() {
    this.redirect();
  }

  redirect() {
    const { joined, user, isUserValid } = this.props;
    console.log('SplashScreen', user, joined, isUserValid);
    if (!user) {
      this.props.navigation.navigate('OnBoardingStep1');
    } else if (!isUserValid && user.onboardingComplete && Object.keys(user).length > 0) {
      console.log('goto editProfile');
    } else if (joined) {
      console.log('goto drinkUp');
    } else if (isUserValid) {
      console.log('goto map');
    } else {
      this.props.navigation.navigate('OnBoardingStep1');
    }
  }

  render() {
    return (
      <View />
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.profile,
  joined: state.drinkup.joined,
  isUserValid: User.isUserValid(state.auth.profile),
});

export default Connect(SplashScreen, mapStateToProps);
