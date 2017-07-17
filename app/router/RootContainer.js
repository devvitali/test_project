import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import AppNavigator from './AppNavigator';
import StartupActions from '../redux/startup';
import ReduxPersist from '../config/reduxPersist';
import styles from './styles';
import { Colors } from '../themes';

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }
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
});

export default connect(null, mapDispatchToProps)(RootContainer);
