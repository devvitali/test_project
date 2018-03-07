import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import styles from './styles';
import AppContainer from '../AppContainer';
import { Button } from '../../components';
import { Images } from '../../themes';

export default class Redeem2For1Screen extends Component {
  static defaultProps = {
    redeemDate: moment(),
  };

  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ currentDate: moment() }), 1000);
  }

  componentWillUpdate(props, state) {
    const { navigation } = props;
    const { params } = navigation.state;
    const { redeemDate } = params;
    if (state.currentDate.diff(redeemDate, 'seconds') > 180) {
      clearInterval(this.interval);
      this.props.navigation.goBack()
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { redeemDate } = params;
    const secondsToExpire = 180 - this.state.currentDate.diff(redeemDate, 'seconds');
    const minutes = secondsToExpire < 0 ? Math.floor(secondsToExpire / 60) : 0;
    const seconds = secondsToExpire < 0 ? secondsToExpire - (minutes * 60) : 0;

    return (
      <AppContainer hideNavBar>
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={[styles.contentContainer, styles.centerContainer]}>
              <Text style={styles.title}>{I18n.t('Redeem_ALKO')}</Text>
              <Image style={styles.image} source={Images.introStep2} />
              <Text style={styles.giftName}>{I18n.t('Redeem_2For1Special')}</Text>
              <Text style={styles.packName}>
                {this.props.bar && this.props.bar.toUpperCase()}
              </Text>
              <Text style={styles.date}>
                {this.props.redeemDate && this.props.redeemDate.format('dddd, MMMM D').toUpperCase()}
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
              theme={'primary'}
              text={I18n.t('close')}
              style={styles.closeButton}
            />
          </View>
        </View>
      </AppContainer>
    );
  }
}
