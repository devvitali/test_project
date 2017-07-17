import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';
import I18n from 'react-native-i18n';
import { firebaseDb } from '../../firebase';
import AppContainer from '../AppContainer';
import NavItems from '../../components/NavigationBar/NavigationBarItems';
import Styles from './styles';
import Button from '../../components/Button';
import { Colors } from '../../themes';

export default class FeedbackScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
    };
  }

  updateFeedback = (feedback) => {
    console.tron.log(`feedback: ${feedback}`);
    this.setState({ feedback });
  };

  doSubmitFeedback = () => {
    const data = {
      feedback: this.state.feedback,
      user_id: this.props.auth.uid,
    };
    new Promise((resolve, reject) => {
      firebaseDb.ref('/feedback').push(data, error => (
        error ? reject(error) : resolve()
      ));
    })
      .then(() => console.tron.log('Thanks!'))
      .catch(() => console.tron.log('Fail!'));
  }

  render() {
    const { feedback } = this.state;
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
            <TextInput
              multiline
              autoFocus
              placeholder="leave contact info if you'd like us to get in touch"
              placeholderTextColor="rgba(255,255,255,0.5)"
              underlineColorAndroid="transparent"
              selectionColor={Colors.snow}
              value={feedback}
              onChangeText={this.updateFeedback}
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
