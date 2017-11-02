import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { isUserValid } from '../../utils/auth';
import { Connect } from '../../redux';
import { Colors } from '../../themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.dark,
  },
});

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.routedScene = '';
  }
  componentWillReceiveProps(newProps) {
    if (this.routedScene === '') {
      this.redirect(newProps);
    }
  }

  navigate(route) {
    if (route !== this.routedScene) {
      if (route === 'DrawerNavigation') {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'DrawerNavigation' })],
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        this.props.navigation.navigate(route);
      }
    }
    this.routedScene = route;
  }
  redirect(newProps) {
    const { joined, user, isUserValid } = newProps;
    console.log('SplashScreen', user, joined, isUserValid);
    if (!user && this.routedScene !== 'OnBoardingStep1') {
      this.navigate('OnBoardingStep1');
    } else if (joined) {
      this.navigate('DrawerNavigation', 'DrinkUpScreen');
      console.log('goto drinkUp');
    } else if (isUserValid) {
      this.navigate('DrawerNavigation');
    } else if (this.routedScene !== 'OnBoardingStep1') {
      this.navigate('OnBoardingStep1');
    }
  }
  render() {
    return (
      <View style={styles.container} />
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.profile,
  joined: state.drinkup.joined,
  isUserValid: isUserValid(state.auth.profile),
});

export default Connect(SplashScreen, mapStateToProps);
