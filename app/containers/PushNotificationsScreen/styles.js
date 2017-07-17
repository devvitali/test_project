// @flow

import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics, ApplicationStyles } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  formContainer: {
    margin: Metrics.doubleBaseMargin,
  },

  sectionTitle: {
    color: Colors.brand.orange,
    fontSize: Fonts.size.h6,
    fontFamily: Fonts.type.primary,
    marginBottom: Metrics.baseMargin,
  },

  description: {
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.doubleBaseMargin,
  },

  settingRow: {
    borderBottomColor: '#333333',
    borderBottomWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingName: {
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.regular,
    color: '#aaaaaa',
    flex: 1,
  },

  switcherStatus: {
    marginHorizontal: 10,
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.medium,
    color: Colors.snow,
  },

  switcherStatusOff: {
    color: '#999999',
  },

});
