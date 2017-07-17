import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

import Styles from './styles';
import Button from '../../components/Button';
import Banner from '../../components/Banner';
import DrinkupActions from '../../redux/drinkup';

class NoDrinkUpScreen extends Component {

  componentDidUpdate() {
    if (this.props.joined) {
      // NavigationActions.drinkUp();
    }
  }

  // this function is only use for demo
  onDraftJoined = () => {
    this.props.startDrinkup(this.props.bar.id, this.props.user);
  }

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
});

const mapDispatchToProps = dispatch => ({
  startDrinkup: (barId, user) => dispatch(DrinkupActions.startDrinkup(barId, user)),
  joinDrinkup: user => dispatch(DrinkupActions.joinDrinkup(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoDrinkUpScreen);
