import React from 'react';
import { StackNavigator } from 'react-navigation';
import SplashScreen from '../containers/SplashScreen';
import {
  OnBoardingStep1,
  OnBoardingStep2,
  OnBoardingStep3,
  OnBoardingStep4,
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

const AppNavigator = StackNavigator({
  SplashScreen: { screen: SplashScreen },
  OnBoardingStep1: { screen: OnBoardingStep1 },
  OnBoardingStep2: { screen: OnBoardingStep2 },
  OnBoardingStep3: { screen: OnBoardingStep3 },
  OnBoardingStep4: { screen: OnBoardingStep4 },
  EditProfileScreen: { screen: EditProfileScreen },
  MapScreen: { screen: MapScreen },
  JoinDrinkUpScreen: { screen: JoinDrinkUpScreen },
  DrinkUpScreen: { screen: DrinkUpScreen },
  PushNotificationsScreen: { screen: PushNotificationsScreen },
  PrivacyPolicyScreen: { screen: PrivacyPolicyScreen },
  TermsOfServiceScreen: { screen: TermsOfServiceScreen },
  FeedBackScreen: { screen: FeedBackScreen },
  SponsoredScreen: { screen: SponsoredScreen },
  Redeem2For1Screen: { screen: Redeem2For1Screen },
}, {
  initialRouteName: 'Redeem2For1Screen',
  headerMode: 'none',
  /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
  // mode: Platform.OS === 'ios' ? 'modal' : 'card',
});
export default () => <AppNavigator />;
