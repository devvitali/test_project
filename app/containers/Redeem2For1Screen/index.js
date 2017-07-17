import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import styles from './styles';
import AppContainer from '../AppContainer';
import Button from '../../components/Button';
import { Images } from '../../themes';

export default class Redeem2For1Screen extends Component {

  static propTypes = {
    bar: PropTypes.string,
    redeemDate: PropTypes.object,
    expiryDate: PropTypes.object,
    onExpire: PropTypes.func,
  };

  static defaultProps = {
    redeemDate: moment(),
    expiryDate: moment().add(3, 'minutes'),
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
    if (state.currentDate.diff(props.expiryDate, 'seconds') === 0) {
      clearInterval(this.interval);
      if (props.onExpire) {
        props.onExpire();
      } else {
        // NavigationActions.pop();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { expiryDate } = this.props;
    const secondsToExpire = expiryDate.diff(this.state.currentDate, 'seconds');
    const minutes = Math.floor(secondsToExpire / 60);
    const seconds = secondsToExpire - (minutes * 60);

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
              onPress={() => { /* NavigationActions.pop()*/ }}
              theme={'disallow'}
              text={I18n.t('close')}
              style={styles.closeButton}
            />
          </View>
        </View>
      </AppContainer>
    );
  }

}
