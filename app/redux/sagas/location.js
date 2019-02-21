import { call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import LocationActions from '../location';
import { watch } from '../../utils/sagaUtils';

let watchID = -1;
const watchLocation = (action) => eventChannel((emit) => {
  const onResult = res => emit(action(res));
  navigator.geolocation.getCurrentPosition(onResult, error => console.log('loc error', error), {
    enableHighAccuracy: true, timeout: 10000, maximumAge: 1000
  });
  watchID = navigator.geolocation.watchPosition(onResult);
  return () => navigator.geolocation.clearWatch(watchID);
});

export function* startBackgroundGeoLocation() {
  // navigator.geolocation.requestAuthorization();
  yield call(watch, watchLocation, LocationActions.onLocationChange);
}
