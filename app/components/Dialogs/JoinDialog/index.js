import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import GeoFire from 'geofire';
import { geoFire } from '../../../firebase';
import { Avatar } from '../../Avatar';
import Button from '../../Button';
import Dialog from '../';
import styles from './styles';
export default class JoinDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: null
    };
    setTimeout(async () => {
      const userLocation = await geoFire('userLocations').get(this.props.uid);
      this.setState({ userLocation });
    });
  }
  getDistance() {
    if (this.state.userLocation && this.props.location) {
      const { latitude, longitude } = this.props.location;
      const { userLocation } = this.state;
      return (GeoFire.distance(userLocation, [latitude, longitude]) / 1.852).toFixed(2);
    }
    return 0;
  }
  render() {
    const { name, avatarSrc, onClose } = this.props;
    const distance = this.getDistance();
    return (
      <Dialog
        subcontent={
          <View style={styles.reportContainer}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.report}>{`${I18n.t('report')} ${name.toLowerCase()}`}</Text>
            </TouchableOpacity>
          </View>
        }
        visible
      >
        <Text style={styles.title}>{`${name} ${I18n.t('Drinkup_WantToJoin')}`}</Text>
        <Avatar
          style={styles.avatar}
          image={{ uri: avatarSrc }}
          imageStyle={styles.avatarImage}
          width={128}
        />
        <Text style={styles.distance}>{`${distance}mi away`}</Text>
        <Button onPress={onClose} text={I18n.t('Drinkup_SendInvite')} />
      </Dialog>
    );
  }
}
