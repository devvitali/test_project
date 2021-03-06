import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { applyComponentTheme } from '../../utils/common';
import styles from './styles';
import ButtonTheme from './theme';

const Button = (props) => {
  const theme = ButtonTheme[props.theme];
  const {
    style, gradient, gradientColors, disabled, disabledStyle, onPress, textStyle, clickable = true, showIndicator
  } = applyComponentTheme(theme, props);
  const ButtonView = gradient ? LinearGradient : View;
  const ButtonProps = {
    activeOpacity: clickable ? 0.7 : 1,
    onPress: clickable ? onPress : null,
  };
  const ButtonViewProps = {
    style: [styles.btn, style, disabled ? disabledStyle : null],
  };
  if (gradient) {
    ButtonViewProps.colors = gradientColors;
  }
  const indicatorColor = props.theme === 'primary' ? '#FFF' : '#888';
  return (
    <TouchableOpacity activeOpacity={clickable ? 0.7 : 1} {...ButtonProps}>
      <ButtonView {...ButtonViewProps}>
        {showIndicator && <ActivityIndicator size="small" animating style={styles.indicator} color={indicatorColor} />}
        <Text style={[styles.btnText, textStyle]}>{props.text.toUpperCase()}</Text>
      </ButtonView>
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  text: 'Button',
  theme: 'primary',
};

export default Button;

