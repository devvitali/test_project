import React from 'react';
import { View, Text, Animated } from 'react-native';

import Styles from './styles';

export default class NavigationBar extends React.Component {

  renderTitle() {
    if (this.props.renderTitle) {
      return this.props.renderTitle();
    }
    if (this.props.title) {
      return (
        <Text style={[Styles.title, this.props.titleStyle]}>{this.props.title.toUpperCase()}</Text>
      );
    }
    return null;
  }

  renderLeftButton() {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton();
    }
    return null;
  }

  renderRightButton() {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }
    return null;
  }

  render() {
    return (
      <Animated.View style={[Styles.container, this.props.navigationBarStyle]}>
        <View style={Styles.buttonContainer}>
          {this.renderLeftButton()}
        </View>
        {this.renderTitle()}
        <View style={Styles.buttonContainer}>
          {this.renderRightButton()}
        </View>
      </Animated.View>
    );
  }
}
