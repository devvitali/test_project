import React, { Component } from 'react';
import { View, ScrollView, Image, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { getDistance } from 'geolib';
import I18n from 'react-native-i18n';
import { map } from 'lodash';
import AppContainer from '../AppContainer';
import { NavItems, MapCallout, BarResult, Button, Banner, IconAlko } from '../../components';
import { AlertActions, BarActions, DrinkupActions, LocationActions } from '../../redux';
import { geoFire } from '../../firebase';
import { Bar } from '../../firebase/models';
import { Colors, Images } from '../../themes';
import Styles from './styles';

const GoogleAPIAvailability = Platform.OS === 'android' ? require('react-native-google-api-availability-bridge') : null;
const METRES_TO_MILES_FACTOR = 0.000621371192237;

class MapScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animatingToRegion: false,
      followUserOnMap: true,
      showUserLocation: true,
      isGooglePlayServicesAvailable: true,
      event: null,
    };
    this.barLocations = {};
    this.addBarInterval = setInterval(() => {
      if (Object.keys(this.barLocations).length > 0) {
        const data = { ...this.barLocations };
        this.barLocations = [];
        console.log('data', data);
        this.props.updateMapBar(data);
      }
    }, 300);
    this.geoQuery = geoFire('barLocations')
      .query({
        center: props.region ? [props.region.latitude, props.region.longitude] : [50, -50],
        radius: 10,
      });

    this.geoQuery.on('ready', () => {
      console.log(`center : ${this.geoQuery.center()}`);
    });

    this.geoQuery.on('key_entered', (barId, location) => {
      // console.log('key_entered', barId, location);
      this.barLocations[barId] = { type: 'add', barId, location };
    });

    this.geoQuery.on('key_exited', (barId) => {
      this.barLocations[barId] = { type: 'remove', barId };
    });
  }

  componentDidMount() {
    this.props.clearBars();
    this.geoQuery.updateCriteria({
      center: [this.props.region.latitude, this.props.region.longitude],
      radius: 100,
    });
    if (GoogleAPIAvailability) {
      GoogleAPIAvailability.checkGooglePlayServices((result) => {
        this.setState({ isGooglePlayServicesAvailable: result === 'success' });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.drinkupBar && prevProps.drinkupBar !== this.props.drinkupBar) {
      this.props.navigation.navigate('JoinDrinkUpScreen', { barId: this.props.drinkupBar.id });
    }
  }

  componentWillUnmount() {
    clearInterval(this.addBarInterval);
    this.props.clearBars();
    this.geoQuery.cancel();
  }

  onRegionChange = (newRegion) => {
    this.geoQuery.updateCriteria({
      center: [newRegion.latitude, newRegion.longitude],
      radius: 100,
    });
  };

  handleEventPress(bar) {
    const title = bar.name;
    this.props.navigation.navigate('SponsoredScreen', { bar, title });
  }

  renderAlert() {
    const { bar } = this.state;
    if (!bar) {
      return null;
    }
    return (
      <Banner
        theme="alert"
        text={bar.event.title}
        iconFamily="alko"
        iconName="badge"
        onPress={() => this.handleEventPress(bar)}
      />
    );
  }

  renderBarMarker(bar, id) {
    if (!bar || !this.props.region) {
      return null;
    }
    const { address, currentDrinkUp, currentSpecial } = bar;
    if (!address) {
      return null;
    }
    let image = '';
    if (currentDrinkUp && currentSpecial) {
      image = Images.pinMugSeal;
    } else if (currentDrinkUp) {
      image = Images.pinMug;
    } else if (currentSpecial) {
      image = Images.pinSeal;
    } else {
      image = Images.pin;
    }

    return (
      <MapView.Marker key={id} coordinate={{ latitude: address.latitude, longitude: address.longitude }}>
        <Image source={image} />
        <MapCallout location={address} onPress={this.calloutPress} />
      </MapView.Marker>
    );
  }

  renderBarResult(bar, id) {
    const { name, currentDrinkUp, currentSpecial, address } = bar;

    const props = {
      name,
      activeDrinkUp: !!currentDrinkUp,
      activeSpecial: !!currentSpecial,
      key: id,
      distance: '',
      onPress: () => this.props.setDrinkupBar({ ...bar, id }),
    };

    if (this.props.location && address) {
      const { latitude, longitude, accuracy } = this.props.location;
      const start = {
        latitude,
        longitude,
      };
      if (address.latitude) {
        const distance = getDistance(start, address, accuracy);
        props.distance = `${(distance * METRES_TO_MILES_FACTOR).toFixed(2)}mi`;
      }
    }

    return <BarResult {...props} />;
  }

  renderBarResults() {
    if (!this.props.bars) {
      return null;
    }
    return map(this.props.bars, (bar, id) => this.renderBarResult(bar, id));
  }

  renderBarMarkers() {
    if (!this.props.bars) {
      return null;
    }
    return map(this.props.bars, (bar, id) => this.renderBarMarker(bar, id));
  }

  renderMap() {
    if (!this.state.isGooglePlayServicesAvailable) {
      return (
        <View style={Styles.noMapContainer}>
          <IconAlko name="map" color={Colors.snow} size={48} style={Styles.noMapIcon} />
          <Text style={Styles.noMapText}>{I18n.t('Map_GoogleMapsNotAvailable')}</Text>
          <Button
            theme="dark"
            style={Styles.noMapButton}
            text={'Update'}
            onPress={GoogleAPIAvailability.openGooglePlayUpdate}
          />
        </View>
      );
    }

    return (
      <MapView
        style={Styles.map}
        initialRegion={this.props.region}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={this.state.showUserLocation}
        ref={ref => this.map = ref}
      >
        {this.renderBarMarkers()}
      </MapView>
    );
  }

  render() {
    return (
      <AppContainer
        title="ALKO"
        renderTitle={NavItems.brandTitle}
        renderLeftButton={NavItems.hamburgerButton(this.props.navigation)}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.mapContainer}>
            {this.renderMap()}
            <View style={Styles.bannerContainer}>
              {this.renderAlert()}
            </View>
          </View>

          <ScrollView style={Styles.barListContainer}>
            {this.renderBarResults()}
          </ScrollView>
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = ({ location, bar, drinkup, alert, auth }) => ({
  region: { ...location.coords, longitudeDelta: 0.16, latitudeDelta: 0.08 },
  bars: location.coords && Bar.constructor.getBarsSortedByDistance(location.coords, bar.bars),
  alerts: alert.alerts,
  profile: auth.profile,
  location: location.coords,
  drinkupBar: drinkup.bar,
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getAlerts: () => dispatch(AlertActions.alertsRequest()),
  startBackgroundGeolocation: () => dispatch(LocationActions.startBackgroundGeolocation()),
  clearBars: () => dispatch(BarActions.clearBars()),
  updateMapBar: bars => dispatch(BarActions.updateMapBar(bars)),
  markAlertAsRead: alert => dispatch(AlertActions.markAlertAsRead(alert)),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
