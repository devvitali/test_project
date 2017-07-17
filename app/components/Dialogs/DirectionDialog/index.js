import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking, Platform } from 'react-native';
import { DirectionsDialog } from './DirectionsDialog';

export default class DirectionsDialogWrapper extends Component {

  static propTypes = {
    bar: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.visible || !newProps.visible) {
      this.setState({ visible: false });
      return;
    }

    if (!this.props.visible && newProps.visible) {
      this.setState({ visible: true });
    }

    if (Platform.OS === 'ios') {
      this.checkForGoogleMaps();
    } else {
      this.openGoogleMaps();
    }
  }

  getGoogleMapsURL() {
    const { bar } = this.props;
    const { address: { city, state } } = bar;
    return `comgooglemaps://?q=${bar.name}, ${city} ${state}`;
  }

  getAppleMapsURL() {
    const { bar } = this.props;
    const { address: { city, state } } = bar;
    return `http://maps.apple.com/?q=${bar.name}, ${city} ${state}`;
  }

  checkForGoogleMaps = () => {
    Linking
      .canOpenURL('comgooglemaps://')
      .then((isSupported) => {
        if (isSupported) {
          this.setState({ visible: true });
        } else {
          this.setState({ visible: false });
          this.openAppleMaps();
        }
      });
  }

  openGoogleMaps = () => {
    const googleMapsURL = this.getGoogleMapsURL();
    Linking.openURL(googleMapsURL);
  };

  openAppleMaps = () => {
    const appleMapsURL = this.getAppleMapsURL();
    Linking.openURL(appleMapsURL);
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
