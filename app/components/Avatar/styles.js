// @flow

import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../themes';

export default StyleSheet.create({
  innerContainer: {
    borderRadius: Metrics.avatarBorderRadius,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.brand.black,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    textAlign: 'center',
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.regular,
    marginTop: Metrics.baseMargin,
  },
  image: {
    borderRadius: Metrics.avatarBorderRadius,
  },
  btnMessage: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 24,
    height: 23,
    borderRadius: 3,
    backgroundColor: Colors.brand.black,
    alignItems: 'flex-end',
  },
  imageBackdrop: {
    borderRadius: Metrics.avatarBorderRadius,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nameDisabled: {
    color: Colors.brand.gray,
  },
});
