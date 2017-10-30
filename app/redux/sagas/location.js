import { all, call, put } from 'redux-saga/effects';
import BackgroundGeoLocation from 'react-native-background-geolocation';
import { eventChannel } from 'redux-saga';

import LocationActions from '../location';
import bgGeoLocationConfig from '../../config/backgroundGeoLocation';
import { watch } from '../../utils/sagaUtils';

const watchBgGeoLocationEvent = (eventName, action) => eventChannel((emit) => {
  const onResult = res => emit(action(res));
  BackgroundGeoLocation.on(eventName, onResult);
  const unsubscribe = () => {
    BackgroundGeoLocation.un(eventName);
  };
  return unsubscribe;
});

const startBgGeoLocation = () => new Promise((resolve, reject) => {
  BackgroundGeoLocation.start(resolve, reject);
});

const reconfigureBackgroundGeoLocation = config => new Promise((resolve, reject) => {
  BackgroundGeoLocation.setConfig(config, (bgLocationState) => {
    if (!bgLocationState.enabled) {
      startBgGeoLocation()
        .then(resolve)
        .catch(reject);
    } else {
      resolve(bgLocationState);
    }
  }, reject);
});

const configureBackgroundGeoLocation = config => new Promise((resolve, reject) => {
  BackgroundGeoLocation.configure(config, (bgLocationState) => {
    if (!bgLocationState.enabled) {
      startBgGeoLocation()
        .then(resolve)
        .catch(reject);
    }
  }, reject);
});

const getBackgroundLocationState = () => new Promise((resolve) => {
  BackgroundGeoLocation.getState(resolve);
});

export function* startBackgroundGeoLocationWatchers() {
  console.log('startBackgroundGeoLocationWatchers');
  yield all([
    // This event fires when movement states changes (stationary->moving; moving->stationary)
    call(watch, watchBgGeoLocationEvent, 'motionchange', LocationActions.onMotionChange),
    // This event fires whenever bgGeo receives a location update.
    call(watch, watchBgGeoLocationEvent, 'location', LocationActions.onLocationChange),
    // This event fires whenever bgGeo receives an error
    // call(watch, watchBgGeoLocationEvent, 'error', LocationActions.onLocationError),
    // This event fires when a chnage in motion activity is detected
    call(watch, watchBgGeoLocationEvent, 'activitychange', LocationActions.onActivityChange),
    // This event fires when the user toggles location-services
    call(watch, watchBgGeoLocationEvent, 'providerchange', LocationActions.onProviderChange),
  ]);
}

export function* startBackgroundGeoLocation({ geoLocationConfig = bgGeoLocationConfig }) {
  try {
    console.log('startBackgroundGeoLocation');
    let bgLocationState = yield call(getBackgroundLocationState, geoLocationConfig);

    if (!bgLocationState) {
      yield call(configureBackgroundGeoLocation, geoLocationConfig);
    }

    bgLocationState = yield call(reconfigureBackgroundGeoLocation, geoLocationConfig);

    yield put(LocationActions.startBackgroundGeoLocationSuccess(bgLocationState.enabled));
  } catch (error) {
    yield put(LocationActions.startBackgroundGeoLocationFailure(error));
  }
}
