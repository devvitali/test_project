import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../themes';
import NavigationBar from '../components/NavigationBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.dark,
  },
  viewContainer: {
    flex: 1,
  },
});

export default class AppContainer extends Component {

  componentDidMount() {

    /*
    this.messageListener = FCM.on(FCMEvent.Notification, async (message) => {
      if (this.props.navigation) {
        this.props.navigation.navigate('DrinkUpScreen');
      }
    });

    FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
      console.log('direct channel connected', data);
    });
    */

  }

  componentWillUnmount() {
    // this.messageListener.remove();
  }

  render() {
    const { hideNavBar, children } = this.props;

    return (
      <View style={styles.container}>
        {!hideNavBar && <NavigationBar {...this.props} />}
        <View style={styles.viewContainer}>
          {children}
        </View>
      </View>
    );
  }

}
