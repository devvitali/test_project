import React, { Component } from 'react';
import { View } from 'react-native';
import { User } from '../../firebase/models';
import { Connect } from '../../redux';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.routedScene = '';
  }
  componentDidMount() {
    this.props.actions.startBackgroundGeolocation();
  }

  componentDidUpdate() {
    if (this.routedScene === '') {
      this.redirect();
    }
  }
  navigate(route) {
    if (route !== this.routedScene) {
      this.props.navigation.navigate(route);
    }
    this.routedScene = route;
  }
  redirect() {
    const { joined, user, isUserValid } = this.props;
    console.log('SplashScreen', user, joined, isUserValid);
    if (!user && this.routedScene !== 'OnBoardingStep1') {
      this.navigate('OnBoardingStep1');
    } else if (!isUserValid && user.onboardingComplete && Object.keys(user).length > 0) {
      this.navigate('EditProfileScreenWithoutSignIn');
    } else if (joined) {
      console.log('goto drinkUp');
    } else if (isUserValid) {
      this.navigate('DrawerNavigation');
    } else if (this.routedScene !== 'OnBoardingStep1') {
      this.navigate('OnBoardingStep1');
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
