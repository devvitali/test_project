import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../';
import { Metrics, Colors, Fonts } from '../../themes';

const text = 'We haven\'t launched in this area yet :(\n\n' +
  'Tell us what your favorite bars are in the area and we\'ll add them to ALKO asap.';
const styles = StyleSheet.create({
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
  buttonContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
});

const NoBarResult = ({ onPress }) => (
  <View style={styles.noBarsContainer}>
    <Text style={styles.noBarLabel}>
      {text}
    </Text>
    <View style={styles.buttonContainer} >
      <Button
        onPress={onPress}
        textStyle={styles.buttonLabel}
        text={'What bars should we add to ALKO?'}
      />
    </View>
  </View>
);
export default NoBarResult;
