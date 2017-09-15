import React, { Component } from 'react';
import { View, ScrollView, Image, Platform, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { getDistance } from 'geolib';
import I18n from 'react-native-i18n';
import { map } from 'lodash';
import AppContainer from '../AppContainer';
import { NavItems, BarResult, Button, Banner, IconAlko, NoBarResult } from '../../components';
import { BarActions, DrinkupActions, LocationActions } from '../../redux';
import { geoFire } from '../../firebase';
import { Colors, Images, Fonts } from '../../themes';
import { calculateDistanceByRegion, hasLocation, isUSArea } from '../../utils/mapUtils';
import { BarsInformation } from './barsInformation';
import styles from './styles';
import mapStyle from './mapStyle';

const GoogleAPIAvailability = Platform.OS === 'android' ? require('react-native-google-api-availability-bridge') : null;
const METRES_TO_MILES_FACTOR = 0.000621371192237;

const boulderPosition = {
  latitude: 40.0822214,
  longitude: -105.14,
};
class MapScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isGooglePlayServicesAvailable: true,
      showBackCurrentLocation: false,
      clusterMarkers: [],
      barResultItems: [],
      markerBarItems: [],
    };
    this.criteriaTimeout = -1;
    this.currentRegion = null;
    this.barLocations = {};
    this.geoQuery = geoFire('barLocations')
      .query({
        center: props.region.latitude ? [props.region.latitude, props.region.longitude] : [50, -50],
        radius: 1,
      });

    this.geoQuery.on('key_entered', BarsInformation.onBarEntered);
    BarsInformation.setCallback(() => {
      const position = this.props.location ? this.props.location : boulderPosition;
      const {
        markerBarItems,
        clusterMarkers,
        barResultItems,
      } = BarsInformation.getBarMarkers(this.currentRegion, position);
      this.setState({ markerBarItems, clusterMarkers, barResultItems });
    });
  }

  componentDidMount() {
    const { clearBars } = this.props;
    clearBars();
    if (GoogleAPIAvailability) {
      GoogleAPIAvailability.checkGooglePlayServices((result) => {
        this.setState({ isGooglePlayServicesAvailable: result === 'success' });
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.location) {
      if (this.criteriaTimeout === -1) {
        this.criteriaTimeout = setTimeout(() => {
          this.geoQuery.updateCriteria({
            center: [newProps.location.latitude, newProps.location.longitude],
            radius: 100,
          });
          this.criteriaTimeout = -1;
        }, 1000);
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.drinkupBar && prevProps.drinkupBar !== this.props.drinkupBar) {
      this.props.navigation.navigate('JoinDrinkUpScreen', { barId: this.props.drinkupBar.id });
    }
  }

  componentWillUnmount() {
    this.props.clearBars();
    this.geoQuery.cancel();
  }
  onBackCurrentLocation = (longitudeDelta = 0.16, latitudeDelta = 0.08) => {
    const position = this.props.location ? this.props.location : boulderPosition;
    this.currentRegion = { ...position, longitudeDelta, latitudeDelta };
    this.map.animateToRegion(this.currentRegion, 1000);
  };
  onClusterMarkerPressed = ({ latitude, longitude }) => {
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
    // if (region.longitudeDelta <= 1.6 && region.latitudeDelta <= 0.8) {
    this.geoQuery.updateCriteria({
      center: [region.latitude, region.longitude],
      radius: calculateDistanceByRegion(region) / 1.1,
    });
    const position = this.props.location ? this.props.location : boulderPosition;
    if (!hasLocation(position, region)) {
      this.setState({ showBackCurrentLocation: true });
    } else {
      this.setState({ showBackCurrentLocation: false });
    }

    const {
      markerBarItems,
      clusterMarkers,
      barResultItems,
    } = BarsInformation.getBarMarkers(this.currentRegion, position);
    this.setState({ markerBarItems, clusterMarkers, barResultItems });

    BarsInformation.subscribeBars(region);
  };

  handleEventPress(bar) {
    const title = bar.name;
    this.props.navigation.navigate('SponsoredScreen', { bar, title });
  }
  navigateFeedBackScreen = () => {
    this.props.navigation.navigate('FeedBackScreen');
  };
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

  renderBarMarker(bar) {
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
        key={bar.barId}
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

  renderBarMarkers() {
    return map(this.state.markerBarItems, (bar, id) => this.renderBarMarker(bar, id));
  }
  renderClusterMarkers() {
    return this.state.clusterMarkers.map((marker) => {
      const fontSize = (Fonts.size.medium - marker.count.length) + 1;
      const id = `${marker.latitude.toFixed(3)}-${marker.longitude.toFixed(3)}-${marker.count}`;
      return (
        <MapView.Marker
          key={id}
          coordinate={marker}
          onPress={() => this.onClusterMarkerPressed(marker)}
        >
          <Image source={Images.pin} />
          <View style={styles.clusterContainer}>
            <Text
              style={[styles.labelClusterCount, { fontSize }]}
            >{marker.count}
            </Text>
          </View>
        </MapView.Marker>
      );
    });
  }
  renderMap() {
    if (!this.state.isGooglePlayServicesAvailable) {
      return (
        <View style={styles.noMapContainer}>
          <IconAlko name="map" color={Colors.snow} size={48} style={styles.noMapIcon} />
          <Text style={styles.noMapText}>{I18n.t('Map_GoogleMapsNotAvailable')}</Text>
          <Button
            theme="dark"
            style={styles.noMapButton}
            text={'Update'}
            onPress={GoogleAPIAvailability.openGooglePlayUpdate}
          />
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
        <View style={styles.mainContainer}>
          <View style={styles.mapContainer}>
            {this.renderMap()}
            <View style={styles.bannerContainer}>
              {this.renderAlert()}
            </View>
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

const mapStateToProps = ({ location, drinkup }) => ({
  region: { ...location.coords, longitudeDelta: 0.01, latitudeDelta: 0.005 },
  location: location.coords,
  drinkupBar: drinkup.bar,
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  startBackgroundGeoLocation: () => dispatch(LocationActions.startBackgroundGeoLocation()),
  clearBars: () => dispatch(BarActions.clearBars()),
  updateMapBar: bars => dispatch(BarActions.updateMapBar(bars)),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
