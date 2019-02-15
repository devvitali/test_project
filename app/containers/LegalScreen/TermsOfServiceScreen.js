import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import AppContainers from '../AppContainer';
import { Document, NavItems } from '../../components';
import { firebaseAnalytics, firebaseConfig } from '../../firebase';
import { download } from '../../utils/downloadUtils';

export default class TermsOfServiceScreen extends Component {

  state = {
    markdown: null,
  }

  componentDidMount() {
    firebaseAnalytics.setCurrentScreen('Terms of Service');

    firebaseConfig.fetch()
      .then(() => firebaseConfig.activateFetched())
      .then(() => firebaseConfig.getValue('terms_of_service'))
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
        title={I18n.t('TERMS_OF_SERVICE')}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        {this.renderContent()}
      </AppContainers>
    );
  }

}
