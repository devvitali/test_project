import React, { Component } from 'react';
import { View, ScrollView, Image, Platform, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { getDistance } from 'geolib';
import I18n from 'react-native-i18n';
import { map, isEqual } from 'lodash';
import AppContainer from '../AppContainer';
import { NavItems, BarResult, Button, Banner, IconAlko, NoBarResult, parseFile } from '../../components';
import { DrinkupActions, LocationActions } from '../../redux';
import { geoFire } from '../../firebase';
import { Colors, Images, Fonts } from '../../themes';
import { calculateDistanceByRegion, hasLocation, isUSArea } from '../../utils/mapUtils';
import { BarsInformation } from './barsInformation';
import { EventsInformation } from './eventInformation';
import styles from './styles';
import mapStyle from './mapStyle';

const googleAPI = Platform.OS === 'android' ? require('react-native-google-api-availability-bridge') : null;
const METRES_TO_MILES_FACTOR = 0.000621371192237;

const boulderPosition = {
  latitude: 40.0822214,
  longitude: -105.14,
};
class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleAPIAvailable: true,
      showBackCurrentLocation: false,
      clusterMarkers: [],
      barResultItems: [],
      markerBarItems: [],
      forceUpdate: false,
    };
    this.criteriaTimeout = -1;
    this.currentRegion = null;
    const geoParam = {
      center: props.region.latitude ? [props.region.latitude, props.region.longitude] : [50, -50],
      radius: 1,
    };
    this.barGeoQuery = geoFire('barLocations').query(geoParam);
    this.eventGeoQuery = geoFire('eventLocations').query({ ...geoParam, radius: 15 });
    this.barGeoQuery.on('key_entered', BarsInformation.onBarEntered);
    this.eventGeoQuery.on('key_entered', EventsInformation.onEventEntered);
    BarsInformation.setCallback(() => {
      const position = this.props.location ? this.props.location : boulderPosition;
      this.setState({ ...BarsInformation.getBarMarkers(this.currentRegion, position) });
    });
    EventsInformation.setCallback(() => this.setState({ forceUpdate: !this.state.forceUpdate }));
  }
  componentDidMount() {
    if (googleAPI) {
      googleAPI.checkGooglePlayServices((result) => {
        this.setState({ googleAPIAvailable: result === 'success' });
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.location && !isEqual(this.props.location, newProps.location)) {
      if (this.criteriaTimeout === -1) {
        this.criteriaTimeout = setTimeout(() => {
          const geoParam = {
            center: [newProps.location.latitude, newProps.location.longitude],
            radius: 100,
          };
          this.barGeoQuery.updateCriteria(geoParam);
          this.eventGeoQuery.updateCriteria({ ...geoParam, radius: 15 });
          this.criteriaTimeout = -1;
        }, 1000);
      }
    }
    if (!this.props.drinkupBar && newProps.drinkupBar) {
      this.props.navigation.navigate('JoinDrinkUpScreen', { barId: newProps.drinkupBar.id });
    }
  }

  componentWillUnmount() {
    this.barGeoQuery.cancel();
    this.eventGeoQuery.cancel();
  }
  onBackCurrentLocation = (longitudeDelta = 0.16, latitudeDelta = 0.08) => {
    const position = this.props.location ? this.props.location : boulderPosition;
    this.currentRegion = { ...position, longitudeDelta, latitudeDelta };
    // this.currentRegion = { ...boulderPosition, longitudeDelta: 0.3, latitudeDelta: 0.15 };
    this.map.animateToRegion(this.currentRegion, 1000);
  };
  onPressClusterMarker = ({ latitude, longitude }) => {
    const longitudeDelta = this.currentRegion.longitudeDelta / 2;
    const latitudeDelta = this.currentRegion.latitudeDelta / 2;
    const region = { latitude, longitude, latitudeDelta, longitudeDelta };
    this.map.animateToRegion(region, 1000);
  };
  onRegionChange = (region) => {
    if (region.longitude >= 180) {
      // eslint-disable-next-line
      region.longitude -= 360;
    }
    this.currentRegion = region;
    const geoParam = {
      center: [region.latitude, region.longitude],
      radius: calculateDistanceByRegion(region) / 1.1,
    };
    this.barGeoQuery.updateCriteria(geoParam);
    this.eventGeoQuery.updateCriteria({ ...geoParam, radius: 15 });
    const position = this.props.location ? this.props.location : boulderPosition;
    if (!hasLocation(position, region)) {
      this.setState({ showBackCurrentLocation: true });
    } else {
      this.setState({ showBackCurrentLocation: false });
    }
    this.setState({ ...BarsInformation.getBarMarkers(this.currentRegion, position) });
    BarsInformation.subscribeBars(region);
  };
  onClickEvent = async (event) => {
    // eslint-disable-next-line
    event.bar = await BarsInformation.getBar(event.barId);
    this.props.navigation.navigate('SponsoredScreen', { event });
  };
  navigateFeedBackScreen = () => {
    this.props.navigation.navigate('FeedBackScreen');
  };
  renderAlert() {
    const position = this.props.location ? this.props.location : boulderPosition;
    const event = EventsInformation.getEvent(position);
    if (event) {
      const eventContent = parseFile(event.content);
      console.log('eventContent', eventContent);
      return (
        <View style={styles.bannerContainer}>
          <Banner
            theme="alert"
            text={eventContent.metadata.title}
            iconFamily="alko"
            iconName="badge"
            onPress={() => this.onClickEvent(event)}
          />
        </View>
      );
    }
    return null;
  }

  renderBarMarker(bar) {
    if (!bar || !this.props.region) {
      return null;
    }
    const { address, currentDrinkUp } = bar;
    const currentSpecial = EventsInformation.checkEventStatus(bar.id);
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
        key={bar.id}
        onPress={() => this.props.setDrinkupBar({ ...bar })}
        coordinate={address}
      >
        <Image source={image} />
      </MapView.Marker>
    );
  }

  renderBarResult(bar, id) {
    const { name, currentDrinkUp, address } = bar;
    const currentSpecial = EventsInformation.checkEventStatus(bar.id);
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
      const start = { latitude, longitude };
      if (address.latitude) {
        const distance = getDistance(start, address, accuracy);
        const position = this.props.location ? this.props.location : boulderPosition;
        if (isUSArea(position)) {
          props.distance = `${(distance * METRES_TO_MILES_FACTOR).toFixed(2)}mi`;
        } else {
          props.distance = `${(distance * 0.001).toFixed(2)}km`;
        }
      }
    }
    return <BarResult {...props} />;
  }

  renderBarResults() {
    if (this.state.barResultItems.length > 0) {
      return (
        <ScrollView style={styles.barListContainer}>
          {map(this.state.barResultItems, (bar, id) => this.renderBarResult(bar, id))}
        </ScrollView>
      );
    }
    return <NoBarResult onPress={this.navigateFeedBackScreen} />;
  }
  renderClusterMarkers() {
    return this.state.clusterMarkers.map((marker) => {
      const fontSize = (Fonts.size.medium - marker.count.length) + 1;
      const id = `${marker.latitude.toFixed(3)}-${marker.longitude.toFixed(3)}-${marker.count}`;
      return (
        <MapView.Marker key={id} coordinate={marker} onPress={() => this.onPressClusterMarker(marker)}>
          <Image source={Images.pin} />
          <View style={styles.clusterContainer}>
            <Text style={[styles.labelClusterCount, { fontSize }]}>
              {marker.count}
            </Text>
          </View>
        </MapView.Marker>
      );
    });
  }
  renderMap() {
    if (!this.state.googleAPIAvailable) {
      return (
        <View style={styles.noMapContainer}>
          <IconAlko name="map" color={Colors.snow} size={48} style={styles.noMapIcon} />
          <Text style={styles.noMapText}>{I18n.t('Map_GoogleMapsNotAvailable')}</Text>
          <Button theme="dark" style={styles.noMapButton} text={'Update'} onPress={googleAPI.openGooglePlayUpdate} />
        </View>
      );
    }
    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        initialRegion={this.props.region}
        rotateEnabled={false}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation
        ref={ref => this.map = ref}
      >
        {map(this.state.markerBarItems, (bar, id) => this.renderBarMarker(bar, id))}
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
        <View style={styles.mainContainer}>
          <View style={styles.mapContainer}>
            {this.renderMap()}
            {this.renderAlert()}
            {this.state.showBackCurrentLocation &&
            <TouchableOpacity
              style={styles.locationButtonContainer}
              onPress={() => this.onBackCurrentLocation(this.currentRegion.latitudeDelta, this.currentRegion.latitudeDelta)}
            >
              <Image source={Images.locationBack} style={styles.imgLocationBack} />
            </TouchableOpacity>
            }
          </View>
          {this.renderBarResults()}
        </View>
      </AppContainer>
    );
  }
}

const location$ = state => state.location;
export const locationSelector = createSelector(location$, (location) => {
  let region = { ...boulderPosition, longitudeDelta: 0.3, latitudeDelta: 0.15 };
  // if (location.coords) {
  //   region = { ...location.coords, longitudeDelta: 0.01, latitudeDelta: 0.005 };
  // }
  return { region, location: location.coords };
});
const drinkupBar$ = state => state.drinkup;
export const drinkupSelector = createSelector(drinkupBar$, drinkup => ({
  drinkupBar: drinkup.bar,
}));
const mapStateToProps = state => ({
  ...locationSelector(state),
  ...drinkupSelector(state),
});

const mapDispatchToProps = dispatch => ({
  startBackgroundGeoLocation: () => dispatch(LocationActions.startBackgroundGeoLocation()),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
