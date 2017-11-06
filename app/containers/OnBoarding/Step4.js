import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Connect } from '../../redux';
import { Button } from '../../components';
import styles from './styles';
import { notificationPermission } from '../../utils/permissionUtils';

class OnboardingPushNotifications extends Component {

  doNotificationPermissionRequest = () => (
    notificationPermission()
      .then((token) => {
        console.log({
          name: 'NotificationPermissionAccepted',
          value: { token },
          important: true,
        });

        this.props.actions.updateProfile({ fcmToken: token });
        this.doCompleteProfile();
      })
      .catch((e) => {
        console.log('err', e);
        this.doCompleteProfile();
      })
  );

  doCompleteProfile = () => {
    const { updateProfile } = this.props.actions;

    updateProfile({ onboardingComplete: true });
    this.props.navigation.navigate('DrawerNavigation');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>{I18n.t('Introduction_step4_title')}</Text>
          <Text style={styles.description}>
            Tilde vaporware meditation mlkshk subway tile, poutine cred 3 wolf moon four dollar toast yuccie vegan.
          </Text>
        </View>
        <View>
          <Button
            text={I18n.t('Introduction_step4_disallow')}
            theme="disallow"
            onPress={this.doCompleteProfile}
            style={styles.firstButton}
          />
          <Button
            text={I18n.t('Introduction_step4_btn')}
            onPress={this.doNotificationPermissionRequest}
          />
        </View>

      </View>
    );
  }
}

export default Connect(OnboardingPushNotifications);
