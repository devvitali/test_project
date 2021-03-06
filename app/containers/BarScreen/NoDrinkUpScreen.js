import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Button, Banner } from '../../components';
import { BarImages } from './BarImages';
import { DrinkupActions } from '../../redux';
import { isProfileComplete } from '../../utils/auth';
import Styles from './styles';

class NoDrinkUpScreen extends Component {
  constructor(props) {
    super(props);
    this.navigateId = '';
  }
  componentWillReceiveProps(newProps) {
    if (newProps.joined) {
      if (this.navigateId === '') {
        this.props.navigation.navigate('DrinkUpScreen', { });
      }
      this.navigateId = 'DrinkUpScreen';
    } else if (this.props.joined && !newProps.joined) {
      this.navigateId = '';
    }
  }
  // this function is only use for demo
  onDraftJoined = () => {
    if (!this.props.waitingInvite) {
      const { draftBar, uid, user, startDrinkup } = this.props;
      const currentUser = { ...user, uid };
      if (isProfileComplete(user)) {
        startDrinkup(draftBar.id, currentUser);
      } else {
        this.props.navigation.navigate('CompleteProfileScene', {
          type: 'Start', barId: draftBar.id,
        });
      }
    }
  };
  onWaitingBar = () => {
    this.props.initDrinkupBar(this.props.bar);
  };
  render() {
    const { special, waitingInvite, bar } = this.props;
    const description = `${I18n.t('Bar_OkayLetsDoThis_Body_Start')} ${bar.name} ${I18n.t('Bar_OkayLetsDoThis_Body_End')}`;
    return (
      <View style={Styles.mainContainer}>
        <BarImages images={bar.images} />
        <View style={Styles.contentContainer}>
          {
            special &&
            <View style={Styles.bannerContainer}>
              <Banner theme="info" text={I18n.t('Drinkup_StartDrinkUpAndGet2For1Drinks')} />
            </View>
          }
          <ScrollView>
            <View style={Styles.section}>
              <Text style={Styles.header}>{I18n.t('Bar_OkayLetsDoThis_Header')}</Text>
              <Text style={Styles.body}>{description}</Text>
            </View>
            {special &&
            <View style={Styles.section}>
              <Text style={Styles.header}>{I18n.t('Bar_WheresMyTwoForOne_Header')}</Text>
              <Text style={Styles.body}>{I18n.t('Bar_WheresMyTwoForOne_Body')}</Text>
            </View>
            }
          </ScrollView>
        </View>
        <View style={Styles.footer}>
          {waitingInvite ?
            <Button onPress={this.onWaitingBar} theme="disallow" text={`waiting for invite at ${bar.name}`} /> :
            <Button
              onPress={this.onDraftJoined}
              text={I18n.t('Bar_StartADrinkUp')}
              showIndicator={this.props.fetching}
            />
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  joined: state.drinkup.joined,
  bar: state.drinkup.bar,
  draftBar: state.drinkup.draftBar,
  user: state.auth.profile,
  uid: state.auth.uid,
  fetching: state.drinkup.fetching,
});

const mapDispatchToProps = dispatch => ({
  startDrinkup: (barId, user) => dispatch(DrinkupActions.startDrinkup(barId, user)),
  initDrinkupBar: bar => dispatch(DrinkupActions.initDrinkupBar(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoDrinkUpScreen);
