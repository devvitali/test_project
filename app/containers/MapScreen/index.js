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
import { calculateRegion } from '../../utils/mapUtils';
import Styles from './styles';

const GoogleAPIAvailability = Platform.OS === 'android' ? require('react-native-google-api-availability-bridge') : null;
const METRES_TO_MILES_FACTOR = 0.000621371192237;
const SCROLL_FREE_TIME = 10000;
const ANIMATE_TO_REGION_TIME = 1000;

const locations = [{
  key: '-KhJS0f_1mrexDl-2ae_',
  location: [40.01916, -102.2753],
}, {
  key: '-KhJS0f_1mrexDl-75h_',
  location: [21.2827, -157.82944],
}, {
  key: '-KhJS0fbYAg0gyyPl3HR',
  location: [40.00988827, -105.278250],
}, {
  key: '-KhJS0fchOJrfMcr4oPa',
  location: [40.0176427, -105.2807],
}, {
  key: '-KhJS0fdfTVS_ZOmOtIt',
  location: [39.984320, -105.2493],
}]
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
    console.log('MapScreen barLocations geoQuery', props.region);

    this.geoQuery = geoFire('barLocations')
      .query({
        center: props.region ? [props.region.latitude, props.region.longitude] : [50, -50],
        radius: 10,
      });
    // locations.map(item => {
    //   geoFire('barLocations').set(item.key, item.location).then(() => {
    //     console.log('Provided key has been added to GeoFire');
    //   });
    // })

    this.geoQuery.on('ready', () => {
      console.log(`center : ${this.geoQuery.center()}`);
    });

    this.geoQuery.on('key_entered', (barId, location) => {
      console.log('key_entered', barId, location);
      this.props.addBar(barId, location);
    });

    this.geoQuery.on('key_exited', (barId) => {
      console.log('key_exited', barId);
      this.props.removeBar(barId);
    });
  }

  componentDidMount() {
    this.props.clearBars();
    if (GoogleAPIAvailability) {
      GoogleAPIAvailability.checkGooglePlayServices((result) => {
        this.setState({ isGooglePlayServicesAvailable: result === 'success' });
      });
    }
  }

  componentWillReceiveProps(newProps) {
    // if (this.map && this.state.followUserOnMap) {
    //   this.setState({ animatingToRegion: true }, () => {
    //     this.map.animateToRegion(calculateRegion([newProps.location], { latPadding: 0.016, longPadding: 0.008 }), ANIMATE_TO_REGION_TIME);
    //     setTimeout(() => this.setState({ animatingToRegion: false }), ANIMATE_TO_REGION_TIME + 500);
    //   });
    // }

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

  onRegionChange = (newRegion) => {
    console.log('onRegionChange', newRegion, this.props.region);
    this.geoQuery.updateCriteria({
      center: [newRegion.latitude, newRegion.longitude],
      radius: 1,
    });

    // if (!this.state.animatingToRegion) {
    //   this.setState({ followUserOnMap: false });
    //   setTimeout(() => {
    //     this.setState({ followUserOnMap: true });
    //   }, SCROLL_FREE_TIME);
    // }
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
      activeDrinkUp: Boolean(currentDrinkUp),
      activeSpecial: Boolean(currentSpecial),
      key: id,
      distance: '',
      onPress: () => this.props.setDrinkupBar(Object.assign({}, bar, { id })),
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
    return (
      map(this.props.bars, (bar, id) => this.renderBarMarker(bar, id))
    );
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
            onPress={() => GoogleAPIAvailability.openGooglePlayUpdate()}
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
        ref={(ref) => { this.map = ref; }}
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

const mapStateToProps = state => ({
  region: state.location.coords && calculateRegion([state.location.coords], { latPadding: 0.016, longPadding: 0.008 }),
  bars: state.location.coords && Bar.constructor.getBarsSortedByDistance(state.location.coords, state.bar.bars),
  orgBars: state.bar.bars,
  alerts: state.alert.alerts,
  profile: state.auth.profile,
  location: state.location.coords,
  drinkupBar: state.drinkup.bar,
});

//eslint-disable-next-line
const mapDispatchToProps = dispatch => ({
  getAlerts: () => dispatch(AlertActions.alertsRequest()),
  startBackgroundGeolocation: () => dispatch(LocationActions.startBackgroundGeolocation()),
  getBars: () => dispatch(BarActions.barsRequest()),
  clearBars: () => dispatch(BarActions.clearBars()),
  addBar: (barId, location) => dispatch(BarActions.addBar(barId, location)),
  removeBar: barId => dispatch(BarActions.removeBar(barId)),
  markAlertAsRead: alert => dispatch(AlertActions.markAlertAsRead(alert)),
  setDrinkupBar: bar => dispatch(DrinkupActions.barRequestSuccessful(bar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
