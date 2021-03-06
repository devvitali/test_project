// @flow
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../themes';

export default StyleSheet.create({
  btn: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: Colors.brand.orange,
  },
  btnText: {
    color: Colors.snow,
    backgroundColor: Colors.transparent,
    fontFamily: Fonts.type.primary,
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: Colors.brand.shadow.orange,
    textShadowOffset: { width: 0, height: 2 },
  },
  darkBtn: {
    backgroundColor: Colors.tundora,
  },
  darkBtnText: {
    color: Colors.brand.gray,
    textShadowColor: Colors.brand.black,
  },
  btnDisallow: {
    backgroundColor: Colors.tundora,
  },
  btnDisallowText: {
    color: '#707070',
    textShadowColor: 'rgb(50,50,50)',
  },
  indicator: {
    marginRight: Metrics.baseMargin,
  }
});
