// @flow

import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mapContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 256,
  },
  map: {
    // For Android :/
    flex: 1,
    height: 256,
  },
  barListContainer: {
    flex: 1,
  },
  bannerContainer: {
    position: 'absolute',
    top: 10,
    left: 25,
    width: Metrics.screenWidth - 50,
  },
  noMapContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brand.black,
  },
  noMapIcon: {
    backgroundColor: Colors.transparent,
    alignSelf: 'center',
  },
  noMapText: {
    color: Colors.snow,
    textAlign: 'center',
    fontFamily: Fonts.type.primary,
    fontSize: Fonts.size.small,
    marginVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
  },
  noMapButton: {
    height: 32,
  },
  locationButtonContainer: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  imgLocationBack: {
    width: 32,
    height: 32,
    tintColor: Colors.brand.darkGray,
  },
  clusterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 3,
  },
  labelClusterCount: {
    fontFamily: Fonts.type.primary,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: Fonts.size.medium,
  },
  noBarsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Metrics.doubleBaseMargin,
  },
  noBarLabel: {
    marginHorizontal: Metrics.doubleBaseMargin,
    fontFamily: Fonts.type.base,
    color: Colors.snow,
    fontSize: Fonts.size.regular,
  },
  buttonLabel: {
    fontSize: Fonts.size.small,
  },
});
