import React from 'react';
import { View, Text, Animated } from 'react-native';

import Styles from './styles';

function renderTitle(props) {
  if (props.renderTitle) {
    return props.renderTitle();
  }
  if (props.title) {
    return (
      <Text style={[Styles.title, props.titleStyle]}>{props.title.toUpperCase()}</Text>
    );
  }
  return null;
}

export default props => (
  <Animated.View style={[Styles.container, props.navigationBarStyle]}>
    <View style={Styles.buttonContainer}>
      {props.renderLeftButton && props.renderLeftButton()}
    </View>
    {renderTitle(props)}
    <View style={Styles.buttonContainer}>
      {props.renderRightButton && props.renderRightButton()}
    </View>
  </Animated.View>
);
