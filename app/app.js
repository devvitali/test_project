import React, { Component } from 'react';
import { AppState, processColor } from 'react-native';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import Instabug from 'instabug-reactnative';
import './i18n'; // keep before root container
import createStore from './redux';
import RootContainer from './router/RootContainer';

const { store } = createStore();

const updateCodePush = () => {
  codePush.sync({
    updateDialog: true,
    installMode: codePush.InstallMode.IMMEDIATE,
  });
};

class App extends Component {

  componentDidMount() {

    Instabug.startWithToken('350cd7e5d499ced551b26651779a17ec', [Instabug.invocationEvent.shake]);
    Instabug.setPrimaryColor(processColor('#FF7604'));

    AppState.addEventListener('change', updateCodePush);
    updateCodePush();
  }

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

export default codePush(codePushOptions)(App);
