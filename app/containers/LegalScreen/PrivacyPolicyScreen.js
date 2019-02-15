import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import AppContainers from '../AppContainer';
import { Document, NavItems } from '../../components';
import { firebaseAnalytics, firebaseConfig } from '../../firebase';
import { download } from '../../utils/downloadUtils';

export default class PrivacyPolicyScreen extends Component {

  state = {
    markdown: null,
  }

  componentDidMount() {
    firebaseAnalytics.setCurrentScreen('Privacy Policy');

    firebaseConfig.fetch()
      .then(() => firebaseConfig.activateFetched())
      .then(() => firebaseConfig.getValue('privacy_policy'))
      .then(data => download(data.val()))
      .then(markdown => this.setState({ markdown }))
      .catch(error => console.log(`Error processing config: ${error}`));
  }

  renderContent() {
    const { markdown } = this.state;
    if (!markdown) {
      return null;
    }

    return <Document file={markdown} />;
  }

  render() {
    return (
      <AppContainers
        title={I18n.t('PRIVACY_POLICY')}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        {this.renderContent()}
      </AppContainers>
    );
  }

}
