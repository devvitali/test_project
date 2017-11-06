import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';
import { Colors } from '../themes';
import NavigationBar from '../components/NavigationBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.dark,
    shadowColor: Colors.brand.black,
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 1.0,
    elevation: 2,
  },
  viewContainer: {
    flex: 1,
  },
});
export default class AppContainer extends Component {
  componentDidMount() {
    this.messageListener = FCM.on(FCMEvent.Notification, async (message) => {
      if (this.props.navigation) {
        this.props.navigation.navigate('DrinkUpScreen');
      }
    });
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.messageListener.remove();
  }
  render() {
    return (
      <View style={styles.container}>
        {!this.props.hideNavBar && <NavigationBar {...this.props} />}
        <View style={styles.viewContainer}>
          {this.props.children}
        </View>
      </View>
    )
  }
}
