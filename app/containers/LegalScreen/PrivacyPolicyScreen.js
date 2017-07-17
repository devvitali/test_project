import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { fetch } from '../../firebase/remote-config';
import { download } from '../../utils/downloadUtils';
import localFile from './privacy-policy.md';
import DocumentScreen from '../../components/Document/DocumentScreen';
import AppContainers from '../AppContainer';
import NavItems from '../../components/NavigationBar/NavigationBarItems';

export default class PrivacyPolicyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  componentDidMount() {
    fetch('privacy_policy')
      .then(download)
      .then(file => this.setState({ file }))
      .catch(() => this.setState({ file: localFile }));
    console.track('viewed_privacy_policy');
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
        title={I18n.t('PRIVACY_POLICY')}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        {this.renderContent()}
      </AppContainers>
    );
  }
}

