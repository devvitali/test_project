import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { getDistance } from 'geolib';
import { Images, Colors, Fonts } from '../../themes';
import { isUSArea } from '../../utils/mapUtils';

const METRES_TO_MILES_FACTOR = 0.000621371192237;
const styles = StyleSheet.create({
  btnContainer: {
    height: 60,
    flex: 1,
  },
  btnActiveDrinkUp: {
    backgroundColor: Colors.brand.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.brand.orange,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  barName: {
    flex: 1,
  },
  btnText: {
    color: Colors.snow,
    fontFamily: Fonts.type.primary,
    fontSize: 15,
  },
});

function renderBarIcon(activeDrinkUp, activeSpecial) {
  if (!activeDrinkUp && !activeSpecial) {
    return null;
  }
  if (activeDrinkUp && activeSpecial) {
    return <Image style={styles.icon} source={Images.mugSeal} />;
  }
  if (activeSpecial) {
    return <Image style={styles.icon} source={Images.seal} />;
  }
  return <Image style={styles.icon} source={Images.mug} />;
}

const BarResult = ({ bar, location, onPress }) => {
  const { name, currentDrinkUp, address, specialId } = bar;
  let distance = 0;
  if (this.props.location && address) {
    const { latitude, longitude, accuracy } = location;
    const start = { latitude, longitude };
    if (address && address.latitude) {
      const position = this.currentRegion;
      if (isUSArea(position)) {
        distance = `${(getDistance(start, address, accuracy) * METRES_TO_MILES_FACTOR).toFixed(2)}mi`;
      } else {
        distance = `${(getDistance(start, address, accuracy) * 0.001).toFixed(2)}km`;
      }
    }
  }
  const buttonStyles = [styles.btnContainer];
  if (currentDrinkUp) {
    buttonStyles.push(styles.btnActiveDrinkUp);
  }
  return (
    <TouchableOpacity activeOpacity={0.7} style={buttonStyles} onPress={onPress}>
      <View style={styles.container}>
        {renderBarIcon(!!currentDrinkUp, !!specialId)}
        <View style={styles.infoContainer}>
          <Text style={[styles.btnText, styles.barName]} numberOfLines={1}>{name}</Text>
          <Text style={styles.btnText}>{distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default BarResult;
