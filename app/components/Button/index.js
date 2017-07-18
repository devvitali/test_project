import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { applyComponentTheme } from '../../utils/common';
import styles from './styles';
import ButtonTheme from './theme';

const Button = (props) => {
  const theme = ButtonTheme[props.theme];
  const {
    style, gradient, gradientColors, disabled, disabledStyle, onPress, textStyle,
  } = applyComponentTheme(theme, props);
  const ButtonView = gradient ? LinearGradient : View;
  const ButtonProps = {
    activeOpacity: 0.7,
    onPress: disabled ? null : onPress,
  };
  const ButtonViewProps = {
    style: [styles.btn, style, disabled ? disabledStyle : null],
  };
  if (gradient) {
    ButtonViewProps.colors = gradientColors;
  }

  return (
    <TouchableOpacity activeOpacity={0.7} {...ButtonProps}>
      <ButtonView {...ButtonViewProps}>
        <Text style={[styles.btnText, textStyle]}>{props.text.toUpperCase()}</Text>
      </ButtonView>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  gradient: PropTypes.bool,
  gradientColors: PropTypes.array,
  disabledStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  disabled: PropTypes.bool,
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  text: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(ButtonTheme)),
  onPress: PropTypes.func,
};
Button.defaultProps = {
  text: 'Button',
  theme: 'primary',
};

export default Button;

