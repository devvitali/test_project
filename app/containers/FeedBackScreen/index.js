import React, { Component } from 'react';
import { Text, TextInput, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import AppContainer from '../AppContainer';
import { Button, NavItems } from '../../components';
import Styles from './styles';
import { firebaseAnalytics, firebaseDb } from '../../firebase';
import { Colors } from '../../themes';

class FeedbackScreen extends Component {

  state = {
    feedback: '',
    successful: false,
  }

  componentDidMount() {
    firebaseAnalytics.setCurrentScreen('Feedback');
  }

  doSubmitFeedback = () => {
    Keyboard.dismiss();
    const data = {
      feedback: this.state.feedback,
      user_id: this.props.uid,
    };
    new Promise((resolve, reject) => {
      firebaseDb.ref('/feedback').push(data, error => (
        error ? reject(error) : resolve()
      ));
    })
      .then(() => {
        this.setState({
          feedback: '',
          successful: true,
        });
        setTimeout(() => this.setState({ successful: false }), 2500);
      })
      .catch(() => console.log('Fail!'));
  };

  render() {
    const { feedback, successful } = this.state;

    return (
      <AppContainer
        title={I18n.t('SEND_FEEDBACK')}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.formContainer}>
            <Text style={Styles.prompt}>
              Have an idea to make ALKO better?
              Want to get your bar involved?
              Just wanna say hi?
            </Text>

            {successful && (
              <Text style={Styles.successMessage}>
                Thanks for your feedback!
              </Text>
            )}

            <TextInput
              multiline
              autoFocus
              placeholder="leave contact info if you'd like us to get in touch"
              placeholderTextColor="rgba(255,255,255,0.5)"
              underlineColorAndroid="transparent"
              selectionColor={Colors.snow}
              value={feedback}
              onChangeText={f => this.setState({ feedback: f })}
              autoCapitalize="none"
              onSubmitEditing={this.doSubmitFeedback}
              autoCorrect
              style={Styles.textarea}
            />
            <Button
              text={I18n.t('Feedback_SendFeedbackButton')}
              onPress={this.doSubmitFeedback}
              style={Styles.button}
            />
          </View>
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.auth.uid,
});

export default connect(mapStateToProps)(FeedbackScreen);
