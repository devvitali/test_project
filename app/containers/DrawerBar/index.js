// @flow
import React, { Component } from 'react';
import { ScrollView, Image, BackAndroid, View, Text, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import AppContainer from '../AppContainer';
import { Connect } from '../../redux';
import DrawerButton from '../../components/DrawerButton';
import styles from './styles';
const avatar = require('../../images/avatar.png');

class DrawBar extends Component {

  static defaultProps = {
    profile: {
      name: '',
    },
  }

  componentDidMount() {
    // BackAndroid.addEventListener('hardwareBackPress', () => {
    //   if (this.context.drawer.props.open) {
    //     this.toggleDrawer();
    //     return true;
    //   }
    //   return false;
    // });
  }

  onLogout = () => {
    this.props.actions.signOut();
    // Just to test onboard multiple times
    // setTimeout(() => this.toggleDrawer(), 500);
    // setTimeout(() => this.props.actions.signIn(), 1500);
  }

  toggleDrawer = () => {
    // this.context.drawer.toggle();
  }

  navigateTo = page => () => {
    this.props.navigation.navigate(page);
    // this.props.actions.setActivePage(page);
    // // NavigationActions[page]();
    // this.props.actions.closeDrawer();
  }

  render() {
    console.log('property', this.props);
    const { activeItemKey, auth: { profile }, joined } = this.props;

    return (
      <AppContainer hideNavBar>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {profile.photoURL ?
                <Image source={{ uri: profile.photoURL }} style={styles.avatar}/> :
                <Image source={avatar} style={styles.avatar} />
              }
            </View>
            <Text style={styles.name}>
              {profile.firstName}
            </Text>
          </View>
          <ScrollView style={styles.contentContainer}>
            {joined ? (
              <DrawerButton
                isActive={activeItemKey === 'DrinkUpScreen'}
                text={I18n.t('DRINK_UP')}
                onPress={this.navigateTo('DrinkUpScreen')}
                iconFamily="alko"
                iconName="mug"
              />
            ) : (
              <DrawerButton
                isActive={activeItemKey === 'MapScreen'}
                text={I18n.t('BARS')}
                onPress={this.navigateTo('MapScreen')}
              />
            )}

            <DrawerButton
              isActive={activeItemKey === 'EditProfileScreen'}
              text={I18n.t('PROFILE')}
              onPress={this.navigateTo('EditProfileScreen')}
            />

            <DrawerButton
              isActive={activeItemKey === 'PushNotificationsScreen'}
              text={I18n.t('PUSH_NOTIFICATIONS')}
              onPress={this.navigateTo('PushNotificationsScreen')}
            />

            <DrawerButton
              isActive={activeItemKey === 'TermsOfServiceScreen'}
              text={I18n.t('TERMS_OF_SERVICE')}
              onPress={this.navigateTo('TermsOfServiceScreen')}
            />

            <DrawerButton
              isActive={activeItemKey === 'PrivacyPolicyScreen'}
              text={I18n.t('PRIVACY_POLICY')}
              onPress={this.navigateTo('PrivacyPolicyScreen')}
            />

            <DrawerButton
              isActive={activeItemKey === 'FeedBackScreen'}
              text={I18n.t('SEND_FEEDBACK')}
              onPress={this.navigateTo('FeedBackScreen')}
            />

          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity onPress={this.onLogout}>
              <Text style={styles.copyright}>© 2017 ALKO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  joined: state.drinkup.joined,
});

export default Connect(DrawBar, mapStateToProps);
