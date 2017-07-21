import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Button, CheersDialog, AvatarList } from '../../components';
import { DrinkupActions } from '../../redux';
import Styles from './styles';

class ItsJustMeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: true,
    };
  }

  onCloseDialog = () => this.setState({ showDialog: false });
  // this function is only use for demo
  onDraftLeave = () => {
    const { bar, user, uid } = this.props;
    this.props.leaveDrinkup(bar, { ...user, uid });
  };
  render() {
    return (
      <View style={Styles.mainContainer}>
        <View style={Styles.contentContainer}>
          {(this.props.bar && this.props.bar.currentSpecial) && (
            <View style={Styles.section}>
              <Text style={Styles.header}>{I18n.t('Bar_ItsJustMe_2for1_Header')}</Text>
              <Text style={Styles.body}>{I18n.t('Bar_ItsJustMe_2for1_Body')}</Text>
            </View>
          )}
          <AvatarList users={this.props.users} />
        </View>
        <View style={Styles.footer}>
          <Text style={Styles.footerText}>{I18n.t('Bar_ItsJustMe_Footer')}</Text>
          <Button
            theme="dark"
            onPress={this.onDraftLeave}
            text={I18n.t('Bar_ItsJustMe_Button')}
          />
        </View>
        <CheersDialog onClose={this.onCloseDialog} visible={this.state.showDialog} />
      </View>
    );
  }

}

const mapStateToProps = state => ({
  bar: state.drinkup.bar,
  users: state.drinkup.users,
  user: state.auth.profile,
  uid: state.auth.uid,
});

const mapDispatchToProps = dispatch => ({
  leaveDrinkup: (bar, user) => dispatch(DrinkupActions.leaveDrinkup(bar, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItsJustMeScreen);
