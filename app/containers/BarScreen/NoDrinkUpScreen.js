import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Button, Banner } from '../../components';
import { DrinkupActions } from '../../redux';
import Styles from './styles';

class NoDrinkUpScreen extends Component {

  componentWillReceiveProps(newProps) {
    if (!this.props.joined && newProps.joined) {
      this.props.navigation.navigate('DrinkUpScreen', { });
    }
  }

  // this function is only use for demo
  onDraftJoined = () => {
    const { bar, uid, user, startDrinkup } = this.props;
    startDrinkup(bar.id, { ...user, uid });
  };
  render() {
    const { special } = this.props;
    return (
      <View style={Styles.mainContainer}>
        {special &&
        <Banner
          theme="info"
          text={I18n.t('Bar_StartADrinkUpForSpecial')}
          style={Styles.banner}
          onPress={this.onDraftJoined}
        />
        }
        <View style={Styles.contentContainer}>
          <View style={Styles.section}>
            <Text style={Styles.header}>{I18n.t('Bar_OkayLetsDoThis_Header')}</Text>
            <Text style={Styles.body}>{I18n.t('Bar_OkayLetsDoThis_Body')}</Text>
          </View>
          {special &&
          <View style={Styles.section}>
            <Text style={Styles.header}>{I18n.t('Bar_WheresMyTwoForOne_Header')}</Text>
            <Text style={Styles.body}>{I18n.t('Bar_WheresMyTwoForOne_Body')}</Text>
          </View>
          }
        </View>
        <View style={Styles.footer}>
          <Button onPress={this.onDraftJoined} text={I18n.t('Bar_StartADrinkUp')} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  joined: state.drinkup.joined,
  bar: state.drinkup.bar,
  user: state.auth.profile,
  uid: state.auth.uid,
});

const mapDispatchToProps = dispatch => ({
  startDrinkup: (barId, user) => dispatch(DrinkupActions.startDrinkup(barId, user)),
  joinDrinkup: user => dispatch(DrinkupActions.joinDrinkup(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoDrinkUpScreen);
