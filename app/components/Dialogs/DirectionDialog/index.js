import React, { Component } from 'react';
import { Linking } from 'react-native';
import { DirectionsDialog } from './DirectionsDialog';

export default class DirectionsDialogWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.visible || !newProps.visible) {
      this.setState({ visible: false });
      return;
    }

    if (!this.props.visible && newProps.visible) {
      this.setState({ visible: true });
      this.checkForGoogleMaps();
    }
  }

  getGoogleMapsURL() {
    const { bar } = this.props;
    const { address, name } = bar;
    return `comgooglemaps://?q=${name}&center=${address.latitude},${address.longitude}`;
  }

  getAppleMapsURL() {
    const { bar } = this.props;
    const { address, name } = bar;
    return `http://maps.apple.com/?q=${name}&ll=${address.latitude},${address.longitude}`;
  }

  checkForGoogleMaps = () => {
    Linking
      .canOpenURL('comgooglemaps://')
      .then((isSupported) => {
        if (isSupported) {
          this.setState({ visible: true });
        } else {
          this.openAppleMaps();
          this.props.onClose();
        }
      });
  }

  openGoogleMaps = () => {
    const googleMapsURL = this.getGoogleMapsURL();
    Linking.openURL(googleMapsURL);
    this.props.onClose();
  };

  openAppleMaps = () => {
    const appleMapsURL = this.getAppleMapsURL();
    Linking.openURL(appleMapsURL);
    this.props.onClose();
  };

  render() {
    return (
      <DirectionsDialog
        openGoogleMaps={this.openGoogleMaps}
        openAppleMaps={this.openAppleMaps}
        visible={this.state.visible}
        onClose={this.props.onClose}
      />
    );
  }
}
