import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import AppNavigator from './AppNavigator';
import { StartupActions, AuthActions } from '../redux';
import styles from './styles';
import { Colors } from '../themes';

class RootContainer extends Component {

  componentDidMount() {
    this.props.startup();

    /*
    FCM.getFCMToken().then((fcmToken) => {
      this.props.updateProfile({ fcmToken });
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (fcmToken) => {
      this.props.updateProfile({ fcmToken });
    });
    */

  }

  componentWillUnmount() {
    this.refreshTokenListener.remove();
  }

  render() {
    return (
      <SafeAreaView style={styles.applicationView}>
        <StatusBar
          backgroundColor={Colors.brand.dark}
          barStyle="light-content"
        />
        <AppNavigator />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup()),
  updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
});

export default connect(null, mapDispatchToProps)(RootContainer);
