import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  startBackgroundGeoLocation: ['geoLocationConfig'],
  startBackgroundGeoLocationSuccess: ['geoLocationEnabled'],
  startBackgroundGeoLocationFailure: ['error'],
  stopBackgroundGeoLocation: [],
  stopBackgroundGeoLocationSuccess: ['enabled'],
  stopBackgroundGeoLocationFailure: ['error'],
  onLocationChange: ['location'],
  onLocationError: ['error'],
  onMotionChange: ['motion'],
  onActivityChange: ['activity'],
  onProviderChange: ['provider'],
});

export const LocationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
const defaultState = {
  geoLocationEnabled: false,
  lastLocationTimestamp: null,
  isMoving: false,
  activity: null,
  coords: null,
  provider: null,
  fetching: null,
  error: null,
};

/* ------------- Reducers ------------- */

const request = state => ({ ...state, fetching: true });

const startBackgroundGeoLocationSuccess = (state, { geoLocationEnabled }) => ({
  ...state,
  geoLocationEnabled,
  error: null,
  fetching: false,
});

const stopBackgroundGeoLocationSuccess = (state, { geoLocationEnabled }) => ({
  ...state,
  geoLocationEnabled,
  error: null,
  fetching: false,
});

const onLocationChange = (state, { location }) => ({
  ...state,
  activity: location.activity.type,
  coords: location.coords,
  // coords: { latitude: 39.9616, longitude: -105.51025 },
  isMoving: location.is_moving,
  lastLocationTimestamp: location.timestamp,
  error: null,
});

const onActivityChange = (state, { activity }) => ({ ...state, activity, error: null });

const onProviderChange = (state, { provider }) => ({ ...state, provider, error: null });

const onMotionChange = (state, { motion }) => ({
  ...state,
  activity: motion.location.activity.type,
  // coords: motion.location.coords,
  coords: { latitude: 39.9616, longitude: -105.51025 },
  isMoving: motion.isMoving,
  lastLocationTimestamp: motion.location.timestamp,
  error: null,
});

const failure = (state, { error }) => ({ ...state, fetching: false, coords: null, error });

/* ------------- Hookup Reducers To Types ------------- */
export const locationReducer = createReducer(defaultState, {
  [Types.START_BACKGROUND_GEO_LOCATION]: request,
  [Types.START_BACKGROUND_GEO_LOCATION_SUCCESS]: startBackgroundGeoLocationSuccess,
  [Types.START_BACKGROUND_GEO_LOCATION_FAILURE]: failure,
  [Types.STOP_BACKGROUND_GEO_LOCATION]: request,
  [Types.STOP_BACKGROUND_GEO_LOCATION_SUCCESS]: stopBackgroundGeoLocationSuccess,
  [Types.STOP_BACKGROUND_GEO_LOCATION_FAILURE]: failure,
  [Types.ON_LOCATION_CHANGE]: onLocationChange,
  [Types.ON_LOCATION_ERROR]: failure,
  [Types.ON_MOTION_CHANGE]: onMotionChange,
  [Types.ON_ACTIVITY_CHANGE]: onActivityChange,
  [Types.ON_PROVIDER_CHANGE]: onProviderChange,
});
