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
  imageWrapper: {
    height: 0,
  },
  overlay: {
    height: 100,
    marginBottom: Metrics.doubleBaseMargin,
  },
  image: {
    width: Metrics.screenWidth - 140,
    height: 100,
  },
  name: {
    color: Colors.snow,
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.type.primary,
    marginBottom: Metrics.baseMargin,
  },
  message: {
    color: Colors.brand.gray,
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.type.primary,
    marginBottom: Metrics.largeMargin,
  },
});
