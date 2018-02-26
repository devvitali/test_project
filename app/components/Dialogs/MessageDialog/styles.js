// @flow

import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../../themes';

export default StyleSheet.create({
  title: {
    color: Colors.snow,
    fontSize: Fonts.size.input,
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
});
