import React, { Component } from 'react';
import { View, ScrollView, Image, Platform, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { getDistance } from 'geolib';
import I18n from 'react-native-i18n';
import { map } from 'lodash';
import AppContainer from '../AppContainer';
import { NavItems, BarResult, Button, Banner, IconAlko } from '../../components';
import { AlertActions, BarActions, DrinkupActions, LocationActions } from '../../redux';
import { geoFire } from '../../firebase';
import { Bar } from '../../firebase/models';
import { getClusters } from '../../utils/clustering';
import { Colors, Images } from '../../themes';
import Styles from './styles';
import mapStyle from './mapStyle';

const GoogleAPIAvailability = Platform.OS === 'android' ? require('react-native-google-api-availability-bridge') : null;
const METRES_TO_MILES_FACTOR = 0.000621371192237;

const boulderPosition = {
  latitude: 40.0822214,
  longitude: -105.14,
};
const BAR_CACHE = {};
class MapScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animatingToRegion: false,
      followUserOnMap: true,
      showUserLocation: true,
      isGooglePlayServicesAvailable: true,
      event: null,
      showBackBoulder: false,
      clusterMarkers: [],
      barResultItems: [],
      markerBarItems: [],
    };
    this.mapZoom = 15;
    this.currentRegion = null;
    this.barLocations = {};
    this.addBarInterval = setInterval(this.onUpdateMapBars, 300);
    this.geoQuery = geoFire('barLocations')
      .query({
        center: props.region.latitude ? [props.region.latitude, props.region.longitude] : [50, -50],
        radius: 1,
      });

    this.geoQuery.on('key_entered', (barId, location) => {
      this.updatedBarLocations = true;
      this.barLocations[barId] = { barId, location };
    });
    this.geoQuery.on('key_exited', (barId) => {
      this.updatedBarLocations = true;
      delete this.barLocations[barId];
    });
  }

  componentDidMount() {
    const { region, clearBars } = this.props;
    clearBars();
    this.geoQuery.updateCriteria({
      center: region.latitude ? [region.latitude, region.longitude] : [50, -50],
      radius: 1,
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
  onUpdateMapBars = () => {
    if (this.updatedBarLocations) {
      const clusterMarkerItems = { ...this.barLocations };
      const barIds = Object.keys(clusterMarkerItems);
      if (barIds.length > 0) {
        const newBarIds = [];
        barIds.forEach(id => BAR_CACHE[id] ? '' : newBarIds.push(id));
        Bar.gets(newBarIds, true)
          .then((result) => {
            let barResultItems = [];
            const markerBarItems = [];
            result.forEach((_bar) => {
              const bar = _bar;
              if (!bar.address) {
                bar.address = {};
              }
              bar.address.latitude = clusterMarkerItems[bar.id].location[0];
              bar.address.longitude = clusterMarkerItems[bar.id].location[1];
              barResultItems.push({ ...bar });
              clusterMarkerItems[bar.id] = { ...clusterMarkerItems[bar.id], ...bar };
              if (bar.currentDrinkUp || bar.currentSpecial) {
                markerBarItems.push(clusterMarkerItems[bar.id]);
                delete clusterMarkerItems[bar.id];
              }
            });
            const clusters = getClusters(clusterMarkerItems, this.mapZoom);
            const clusterMarkers = [];
            clusters.forEach(({ properties, geometry }) => {
              const latitude = geometry.coordinates[1];
              const longitude = geometry.coordinates[0];
              if (properties.cluster) {
                clusterMarkers.push({
                  count: properties.point_count,
                  latitude,
                  longitude,
                });
              } else {
                markerBarItems.push(clusterMarkerItems[properties.barId]);
              }
            });
            const { location } = this.props;
            if (location) {
              barResultItems = Bar.constructor.getBarsSortedByDistance(location, barResultItems);
            }
            this.setState({ clusterMarkers, barResultItems, markerBarItems });
          });
        // this.props.updateMapBar(updatedBars);
      }
    }
    this.updatedBarLocations = false;
  };
  onBackBoulder = (longitudeDelta = 0.16, latitudeDelta = 0.08) => {
    // const position = this.props.location ? this.props.location : boulderPosition;
    this.currentRegion = { ...boulderPosition, longitudeDelta, latitudeDelta };
    this.map.animateToRegion(this.currentRegion, 10);
  };
  onCluserMarkerPressed = ({ latitude, longitude }) => {
    const longitudeDelta = this.currentRegion.longitudeDelta / 2;
    const latitudeDelta = this.currentRegion.latitudeDelta / 2;
    const region = { latitude, longitude, latitudeDelta, longitudeDelta };
    this.map.animateToRegion(region, 1000);
  };
  onRegionChange = (region) => {
    this.currentRegion = region;
    if (region.longitudeDelta < 1.6 && region.latitudeDelta < 0.8) {
      this.mapZoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
      const start = {
        latitude: region.latitude - (region.latitudeDelta / 2),
        longitude: region.longitude - (region.longitudeDelta / 2),
      };
      const end = {
        latitude: region.latitude + (region.latitudeDelta / 2),
        longitude: region.longitude + (region.longitudeDelta / 2),
      };
      let distance = getDistance(start, end) * 0.0004;
      this.geoQuery.updateCriteria({
        center: [region.latitude, region.longitude],
        radius: distance,
      });
      const position = this.props.location ? this.props.location : boulderPosition;
      distance = getDistance(position, region) * 0.001;
      if (distance > 10) {
        this.setState({ showBackBoulder: true });
      } else {
        this.setState({ showBackBoulder: false });
      }
      this.updatedBarLocations = true;
      this.onUpdateMapBars();
    } else {
      this.onBackBoulder(1.2, 0.6);
    }
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
      <MapView.Marker
        key={id}
        onPress={() => this.props.setDrinkupBar({ ...bar })}
        coordinate={{ latitude: address.latitude, longitude: address.longitude }}
      >
        <Image source={image} />
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
      onPress: () => this.props.setDrinkupBar({ ...bar }),
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
    return map(this.state.barResultItems, (bar, id) => this.renderBarResult(bar, id));
  }

  renderBarMarkers() {
    return map(this.state.markerBarItems, (bar, id) => this.renderBarMarker(bar, id));
  }
  renderClusterMarkers() {
    return this.state.clusterMarkers.map((marker, id) => (
      <MapView.Marker key={id} coordinate={marker} onPress={() => this.onCluserMarkerPressed(marker)}>
        <Image source={Images.cluster} />
        <View style={Styles.clusterContainer}>
          <Text style={Styles.labelClusterCount}>{marker.count}</Text>
        </View>
      </MapView.Marker>
    ));
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
        customMapStyle={mapStyle}
        initialRegion={this.props.region}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={this.state.showUserLocation}
        ref={ref => this.map = ref}
      >
        {this.renderBarMarkers()}
        {this.renderClusterMarkers()}
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
            {this.state.showBackBoulder &&
            <TouchableOpacity
              style={Styles.locationButtonContainer}
              onPress={() => this.onBackBoulder()}
            >
              <Image source={Images.locationBack} style={Styles.imgLocationBack} />
            </TouchableOpacity>
            }
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
  region: { ...location.coords, longitudeDelta: 0.08, latitudeDelta: 0.04 },
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
