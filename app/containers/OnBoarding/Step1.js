import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import styles from './styles';
import { Button } from '../../components';

const navigateStep2 = props => props.navigation.navigate('OnBoardingStep2');
export default props => (
  <View style={styles.container}>
    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{I18n.t('Introduction_welcome')}</Text>
        <Text style={styles.description}>{I18n.t('Introduction_aboutAlko')}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{I18n.t('Introduction_why')}</Text>
        <Text style={styles.description}>{I18n.t('Introduction_reason')}</Text>
      </View>
    </ScrollView>
    <View styles={styles.footer}>
      <Button text={I18n.t('Introduction_next')} onPress={() => navigateStep2(props)} />
    </View>
  </View>
);
