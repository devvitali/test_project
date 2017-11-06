import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics, ApplicationStyles } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  formContainer: {
    padding: Metrics.doubleBaseMargin,
    flex: 1,
  },

  selectPhotoContainer: {
    marginBottom: Metrics.doubleBaseMargin * 2,
  },
  waitingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: Metrics.doubleBaseMargin,
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoContainer: {
    alignSelf: 'center',
    width: 128,
    height: 128,
    borderWidth: 2,
    borderColor: Colors.snow,
    borderRadius: Metrics.avatarBorderRadius,
    marginTop: Metrics.doubleBaseMargin,
    overflow: 'hidden',
  },
  photo: {
    width: 128,
    height: 128,
    overflow: 'hidden',
  },

  updatePhoto: {
    alignSelf: 'center',
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: 12,
    marginTop: Metrics.doubleBaseMargin,
  },

  labelContainer: {
    borderBottomColor: Colors.brand.gray,
    borderStyle: 'solid',
    height: 46,
    marginBottom: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin / 2,
    position: 'relative',
  },

  label: {
    marginTop: Metrics.doubleBaseMargin,
    color: Colors.brand.gray,
    fontSize: 14,
  },

  input: {
    color: Colors.snow,
    fontSize: 24,
    fontFamily: Fonts.type.primary,
    left: 90,
    right: 0,
    top: 0,
    bottom: -10,
    paddingLeft: Metrics.baseMargin,
    position: 'absolute',
  },

  iconContainer: {
    flexDirection: 'row',
    marginTop: Metrics.doubleBaseMargin,
  },

  iconButton: {
    flex: 1,
  },

  drinkIcon: {
    resizeMode: 'contain',
  },

  unselected: {
    opacity: 0.7,
  },

  spacer: {
    height: Metrics.doubleBaseMargin,
  },

  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  incompleteProfileText: {
    color: Colors.snow,
    marginBottom: 10,
    textAlign: 'center',
  },

});
