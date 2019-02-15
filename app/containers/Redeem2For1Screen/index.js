import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { firebaseAnalytics } from '../../firebase';
import styles from './styles';
import AppContainer from '../AppContainer';
import { Button } from '../../components';
import { Images } from '../../themes';
import { SpecialRedemption } from '../../firebase/models';

class Redeem2For1Screen extends Component {

  state = {
    redemption: null,
    // eslint-disable-next-line react/no-unused-state
    counter: 0,
  }

  componentDidMount() {
    const { bar, uid } = this.props;

    SpecialRedemption
      .getByBarAndUser(bar.id, uid)
      .then((redemption) => {

        if (!redemption) {
          // eslint-disable-next-line no-param-reassign
          redemption = SpecialRedemption.setByBarAndUser(bar.id, uid);
        }

        this.setState({ redemption }, this.startInterval);
      });

    firebaseAnalytics.setCurrentScreen('Redeem Special');
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startInterval = () => {
    const { redemption } = this.state;

    this.interval = setInterval(() => {
      if (SpecialRedemption.hasExpired(redemption.timestamp)) {
        this.props.navigation.goBack();
      }
      this.setState(state => ({ counter: state.counter + 1 }));
    }, 1000);
  }

  render() {
    const { redemption } = this.state;
    const { bar } = this.props;

    if (!redemption) {
      return null;
    }

    const secondsRemaining = SpecialRedemption.secondsRemaining(redemption.timestamp);
    const seconds = Math.round(secondsRemaining % 60, 0);
    const minutes = Math.round((secondsRemaining - seconds) / 60, 0);

    return (
      <AppContainer hideNavBar>
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={[styles.contentContainer, styles.centerContainer]}>
              <Text style={styles.title}>{I18n.t('Redeem_ALKO')}</Text>
              <Image style={styles.image} source={Images.introStep2} />
              <Text style={styles.giftName}>{I18n.t('Redeem_2For1Special')}</Text>
              <Text style={styles.barName}>
                {bar.name.toUpperCase()}
              </Text>
              <Text style={styles.date}>
                {moment().format('dddd, MMMM D').toUpperCase()}
              </Text>
              <View style={styles.timeoutContainer}>
                <Text style={styles.disappearTime}>
                  {`${I18n.t('Redeem_ThisDealWillDisappear')} ${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds} seconds`}`}
                </Text>
              </View>
              <View style={styles.guideContainer}>
                <Text style={styles.guide}>{I18n.t('Redeem_GuideToRedeem')}</Text>
              </View>
            </View>
          </ScrollView>
          <View styles={styles.footer}>
            <Button
              onPress={() => this.props.navigation.goBack()}
              theme="primary"
              text={I18n.t('close')}
              style={styles.closeButton}
            />
          </View>
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.auth.uid,
  bar: state.drinkup.bar,
});

export default connect(mapStateToProps)(Redeem2For1Screen);
