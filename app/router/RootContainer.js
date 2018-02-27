import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import FCM, { FCMEvent } from 'react-native-fcm';

import AppNavigator from './AppNavigator';
import { StartupActions, AuthActions } from '../redux';
import styles from './styles';
import { Colors } from '../themes';

class RootContainer extends Component {
  componentDidMount() {
    this.props.startup();
    FCM.getFCMToken().then((fcmToken) => {
      this.props.updateProfile({ fcmToken });
      // store fcm token in your server
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (fcmToken) => {
      this.props.updateProfile({ fcmToken });
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.refreshTokenListener.remove();
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar
          backgroundColor={Colors.brand.dark}
          barStyle="light-content"
        />
        <AppNavigator />
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
  updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
});

export default connect(null, mapDispatchToProps)(RootContainer);
