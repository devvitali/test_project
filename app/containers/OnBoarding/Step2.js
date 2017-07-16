import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';

import styles from './styles';
import Button from '../../components/Button';
import { Images } from '../../themes';

const navigateStep3 = props => props.navigation.navigate('OnBoardingStep3');
export default props => (
  <View style={styles.container}>
    <ScrollView style={styles.contentContainer}>
      <View style={[styles.contentContainer, styles.centerContainer]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.stepTitle]}>{I18n.t('Introduction_step2_title')}</Text>
          <Text style={[styles.description, styles.stepSubtitle]}>{I18n.t('Introduction_step2_subtitle')}</Text>
        </View>
        <Image style={styles.stepImage} source={Images.introStep2} />
        <Text style={[styles.description, styles.stepSubtitle]}>{I18n.t('Introduction_step2_description')}</Text>
      </View>
    </ScrollView>
    <View styles={styles.footer}>
      <Button text={I18n.t('Introduction_step2_btn')} onPress={() => navigateStep3(props)} />
    </View>
  </View>
);
