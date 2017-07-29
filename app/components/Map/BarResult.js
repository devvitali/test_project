import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { Images, Colors, Fonts } from '../../themes';

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

const BarResult = (props) => {
  const { name, activeDrinkUp, activeSpecial, distance, textStyle, onPress } = props;
  const buttonStyles = [styles.btnContainer, props.style];
  if (activeDrinkUp) {
    buttonStyles.push(styles.btnActiveDrinkUp);
  }
  return (
    <TouchableOpacity activeOpacity={0.7} style={buttonStyles} onPress={onPress}>
      <View style={styles.container}>
        {renderBarIcon(activeDrinkUp, activeSpecial)}
        <View style={styles.infoContainer}>
          <Text style={[styles.btnText, styles.barName]} numberOfLines={1}>{name}</Text>
          <Text style={[styles.btnText, textStyle]}>{distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
BarResult.propTypes = {
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  name: PropTypes.string,
  activeDrinkUp: PropTypes.bool,
  activeSpecial: PropTypes.bool,
  distance: PropTypes.string,
  onPress: PropTypes.func,
};
export default BarResult;
