import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics, ApplicationStyles } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  formContainer: {
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
  },

  prompt: {
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: Metrics.doubleBaseMargin,
  },

  successMessage: {
    color: Colors.brand.orange,
    fontFamily: Fonts.type.bold,
    fontSize: 15,
    marginTop: Metrics.doubleBaseMargin,
  },

  textarea: {
    height: 180,
    borderColor: Colors.tundora,
    borderWidth: 1,
    borderRadius: 5,
    color: '#FFFFFF',
    fontFamily: Fonts.type.primary,
    marginTop: Metrics.doubleBaseMargin,
    paddingTop: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin * 1.5,
    paddingBottom: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin * 1.5,
    textAlignVertical: 'top',
  },

  button: {
    marginTop: Metrics.doubleBaseMargin,
  },
});
