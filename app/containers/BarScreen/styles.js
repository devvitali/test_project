// @flow

import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  footer: {
    padding: Metrics.doubleBaseMargin,
    paddingTop: 0,
  },
  bannerContainer: {
    marginHorizontal: Metrics.doubleBaseMargin,
    marginVertical: Metrics.doubleBaseMargin,
  },
  contentContainer: {
    flex: 1,
  },
  banner: {
    margin: Metrics.doubleBaseMargin,
  },

  section: {
    margin: Metrics.doubleBaseMargin,
  },

  header: {
    color: Colors.brand.orange,
    fontSize: Fonts.size.h6,
    fontFamily: Fonts.type.primary,
    marginBottom: Metrics.baseMargin,
  },

  body: {
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.medium,
    lineHeight: Fonts.size.medium * 1.5,
  },

  footerText: {
    color: Colors.brand.gray,
    paddingBottom: Metrics.baseMargin,
    textAlign: 'center',
    fontFamily: Fonts.type.primary,
  },

  container: {
    flex: 1,
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.largeMargin,
    backgroundColor: Colors.brand.dark,
  },

  waitingInviteText: {
    marginTop: Metrics.largeMargin,
    color: Colors.brand.orange,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.h5,
    textAlign: 'center',
  },

});
