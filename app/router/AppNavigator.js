import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import SplashScreen from '../containers/SplashScreen';
import {
  OnBoardingStep1,
  OnBoardingStep2,
  OnBoardingStep3,
} from '../containers/OnBoarding';
import EditProfileScreen from '../containers/EditProfileScreen';
import MapScreen from '../containers/MapScreen';
import { JoinDrinkUpScreen, DrinkUpScreen } from '../containers/BarScreen';
import PushNotificationsScreen from '../containers/PushNotificationsScreen';
import {
  PrivacyPolicyScreen,
  TermsOfServiceScreen,
} from '../containers/LegalScreen';
import FeedBackScreen from '../containers/FeedBackScreen';
import SponsoredScreen from '../containers/SponsoredScreen';
import Redeem2For1Screen from '../containers/Redeem2For1Screen';
import DrawerBar from '../containers/DrawerBar';

const DrinkupNavigator = createStackNavigator(
  {
    MapScreen: { screen: MapScreen },
    JoinDrinkUpScreen: { screen: JoinDrinkUpScreen },
    SponsoredScreen: { screen: SponsoredScreen },
    CompleteProfileScene: { screen: EditProfileScreen },
  },
  {
    initialRouteName: 'MapScreen',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
  }
);

const DrawerNavigation = createDrawerNavigator(
  {
    EditProfileScreen: { screen: EditProfileScreen },
    FeedBackScreen: { screen: FeedBackScreen },
    PushNotificationsScreen: { screen: PushNotificationsScreen },
    PrivacyPolicyScreen: { screen: PrivacyPolicyScreen },
    TermsOfServiceScreen: { screen: TermsOfServiceScreen },
    MapNavigator: { screen: DrinkupNavigator },
    DrinkUpScreen: { screen: DrinkUpScreen },
  },
  {
    initialRouteName: 'MapNavigator',
    contentComponent: props => <DrawerBar {...props} />,
  }
);

const AppNavigator = createStackNavigator({
  SplashScreen: { screen: SplashScreen },
  OnBoardingStep1: { screen: OnBoardingStep1 },
  OnBoardingStep2: { screen: OnBoardingStep2 },
  OnBoardingStep3: { screen: OnBoardingStep3 },
  Redeem2For1Screen: { screen: Redeem2For1Screen },
  DrawerNavigation: { screen: DrawerNavigation },
}, {
  initialRouteName: 'SplashScreen',
  headerMode: 'none',
  /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
  // mode: Platform.OS === 'ios' ? 'modal' : 'card',
  cardStyle: { shadowColor: 'transparent' },
});

const App = createAppContainer(AppNavigator);

export default () => <App />;
