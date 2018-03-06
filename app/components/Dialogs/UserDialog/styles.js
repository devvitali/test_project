// @flow

import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../../themes';

export default StyleSheet.create({
  dialogStyle: {
    width: Metrics.screenWidth - 50,
  },
  dialogContainer: {
    width: Metrics.screenWidth - 30,
  },
  title: {
    color: Colors.snow,
    fontSize: Fonts.size.h4,
    fontFamily: Fonts.type.primary,
    marginBottom: 25,
    textAlign: 'center',
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: Metrics.baseMargin,
  },
  avatarImage: {
    borderWidth: 2,
    borderColor: Colors.brand.gray,
    borderRadius: 10,
  },
  message: {
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.regular,
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin,
  },
  time: {
    color: Colors.brand.gray,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.baseMargin,
  }
});
