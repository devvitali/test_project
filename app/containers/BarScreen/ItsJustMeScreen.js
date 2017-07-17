import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

import Styles from './styles';
import Button from '../../components/Button';
import { AvatarList } from '../../components/Avatar';
import CheersDialog from '../../components/Dialogs/CheersDialog';
import DrinkupActions from '../../redux/drinkup';
import { requestingMember } from '../../fixture/drinkupMembers';

class ItsJustMeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDialog: true,
    };
  }

  componentDidUpdate() {
    if (this.props.joined !== null && !this.props.joined) {
      // NavigationActions.map();
    }
  }

  onCloseDialog = () => {
    this.setState({ showDialog: false });
  }

  // this function is only use for demo
  onDraftLeave = () => {
    this.props.leaveDrinkup(requestingMember);
  }

  renderCheersDialog() {
    return (
      <CheersDialog
        onClose={this.onCloseDialog}
        visible={this.state.showDialog}
      />
    );
  }

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
        {this.renderCheersDialog()}
      </View>
    );
  }

}

const mapStateToProps = state => ({
  joined: state.drinkup.joined,
  bar: state.drinkup.bar,
  users: state.drinkup.users,
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  leaveDrinkup: user => dispatch(DrinkupActions.leaveDrinkup(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItsJustMeScreen);
