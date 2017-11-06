import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import AppContainers from '../AppContainer';
import { Document, NavItems } from '../../components';
import { download } from '../../utils/downloadUtils';
import localFile from './terms-of-service.md';

export default class TermsOfServiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: localFile,
    };
  }
  renderContent() {
    const { file } = this.state;
    if (!file) {
      return null;
    }
    return <Document file={file} />;
  }
  render() {
    return (
      <AppContainers
        navigation={this.props.navigation}
        title={I18n.t('TERMS_OF_SERVICE')}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        {this.renderContent()}
      </AppContainers>
    );
  }
}
