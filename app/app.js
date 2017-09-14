// @flow

import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import Instabug from 'instabug-reactnative';
import FCM from 'react-native-fcm';
import './i18n'; // keep before root container
import createStore from './redux';
import applyConfigSettings from './config';
import { trackEvent } from './utils/googleAnalytics';
import RootContainer from './router/RootContainer';

// Apply config overrides
applyConfigSettings();
// create our store
const store = createStore();
const updateCodePush = () => {
  codePush.sync({
    updateDialog: true,
    installMode: codePush.InstallMode.IMMEDIATE,
  });
};

class App extends Component {

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChanged);
    FCM.requestPermissions(); // for iOS
    Instabug.startWithToken('20b5579b22c3616afeeed631ace29330', Instabug.invocationEvent.shake);
    trackEvent('test', 'testevent');
  }
  // onHandleOpenURL = (event) => {
  //   // const route = event.url.replace(/.*?:\/\//g, '');
  //   // do something with the url, in our case navigate(route)
  // };
  onAppStateChanged = () => {
    updateCodePush();
  };
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}
const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
export default codePush(codePushOptions)(App);
