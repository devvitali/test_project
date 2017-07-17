import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { fetch } from '../../firebase/remote-config';
import { download } from '../../utils/downloadUtils';
import localFile from './terms-of-service.md';
import DocumentScreen from '../../components/Document/DocumentScreen';
import AppContainers from '../AppContainer';
import NavItems from '../../components/NavigationBar/NavigationBarItems';

export default class TermsOfServiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }
  componentDidMount() {
    fetch('terms_of_service')
      .then(download)
      .then(file => this.setState({ file }))
      .catch(() => this.setState({ file: localFile }));
    console.track('viewed_terms_of_service');
  }

  renderContent() {
    const { file } = this.state;
    if (!file) {
      return null;
    }
    return <DocumentScreen file={file} />;
  }
  render() {
    return (
      <AppContainers
        title={I18n.t('TERMS_OF_SERVICE')}
        renderLeftButton={NavItems.hamburgerButton()}
      >
        {this.renderContent()}
      </AppContainers>
    );
  }
}