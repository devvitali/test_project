import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import I18n from 'react-native-i18n';
import styles from './styles';
import { Button } from '../../components';
import { locationPermission } from '../../utils/permissionUtils';

const requestLocationPermission = (props) => {
  locationPermission()
    .then(() => {
      console.tron.display({
        name: 'LocationPermissionAccepted',
        value: {},
        important: true,
      });
      props.navigation.navigate('OnBoardingStep4');
    })
    .catch((e) => {
      console.log('requestLocationPermission err', e);
      Alert.alert(
        'Location data permissions',
        'Your device does not support location services.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => props.navigation.navigate('OnBoardingStep4') },
        ]
      );
    });
};

export default props => (
  <View style={styles.container}>
    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{I18n.t('Introduction_step3_title')}</Text>
        <Text style={styles.description}>{I18n.t('Introduction_step3_description')}</Text>
      </View>
    </ScrollView>
    <View styles={styles.footer}>
      <Button onPress={() => requestLocationPermission(props)} text={I18n.t('Introduction_step3_btn')} />
    </View>
  </View>
);
