// @flow

import React, { Component } from 'react';
import { Provider } from 'react-redux';
// import FCM, { FCMEvent } from 'react-native-fcm';
import './i18n'; // keep before root container
import createStore from './redux';
import applyConfigSettings from './config';
import RootContainer from './router/RootContainer';

// Apply config overrides
applyConfigSettings();
// create our store
const store = createStore();

class App extends Component {

  componentDidMount() {
    // this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
    //   console.tron.display({
    //     name: 'NotificationReceived',
    //     value: { notif },
    //     important: true,
    //   });
    //
    //   notif.finish();
    // });
    //
    // this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
    //   console.tron.display({
    //     name: 'FCM_TOKEN_REFRESH',
    //     value: { token },
    //     important: true,
    //   });
    // });

  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

export default App;
