import React, { Component } from 'react';
import { Linking } from 'react-native';
import { geoFire } from '../../../firebase'
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

  async getGoogleMapsURL() {
    const { bar } = this.props;
    const { name, id } = bar;
    const location = await geoFire('barLocations').get(id);
    return `comgooglemaps://?q=${name}&center=${location[0]},${location[1]}`;
  }

  async getAppleMapsURL() {
    const { bar } = this.props;
    const { name, id } = bar;
    const location = await geoFire('barLocations').get(id);
    return `http://maps.apple.com/?q=${name}&ll=${location[0]},${location[1]}`;
  }

  checkForGoogleMaps = () => {
    Linking
      .canOpenURL('comgooglemaps://')
      .then(async (isSupported) => {
        if (isSupported) {
          this.setState({ visible: true });
        } else {
          await this.openAppleMaps();
          this.props.onClose();
        }
      });
  }

  openGoogleMaps = async () => {
    const googleMapsURL = await this.getGoogleMapsURL();
    Linking.openURL(googleMapsURL);
    this.props.onClose();
  };

  openAppleMaps = async () => {
    const appleMapsURL = await this.getAppleMapsURL();
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
