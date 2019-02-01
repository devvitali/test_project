import { Colors, Metrics, Fonts } from '../../themes';

const navButton = {
  backgroundColor: Colors.transparent,
  justifyContent: 'center',
  width: 35,
  height: 35,
};

export default {
  container: {
    paddingTop: 0,
    height: Metrics.navBarHeight,
    paddingHorizontal: Metrics.baseMargin,
    backgroundColor: Colors.brand.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.brand.gray,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    width: 35,
  },
  leftButton: {
    // paddingTop: Metrics.baseMargin,
  },
  title: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    height: Metrics.navBarHeight - Metrics.doubleBaseMargin,
    width: Metrics.navBarHeight - Metrics.doubleBaseMargin,
    resizeMode: 'contain',
  },
  rightButton: {
    paddingTop: Metrics.baseMargin,
  },
  backButton: {
    ...navButton,
    paddingBottom: 4,
    paddingLeft: 10,
    width: 45,
    marginRight: 20,
  },
  navButtonLeft: {
    ...navButton,
  },
  navButtonRight: {
    ...navButton,
  },
  icon: {
    alignSelf: 'center',
  },
};
