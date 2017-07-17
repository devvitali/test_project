// @flow

import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../../themes';

export default StyleSheet.create({
  title: {
    color: Colors.snow,
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.type.primary,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center',
  },
  button: {
    marginTop: Metrics.doubleBaseMargin,
  },
});
