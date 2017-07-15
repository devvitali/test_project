import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  startBackgroundGeolocation: ['geolocationConfig'],
  startBackgroundGeolocationSuccess: ['geolocationEnabled'],
  startBackgroundGeolocationFailure: ['error'],
  stopBackgroundGeolocation: [],
  stopBackgroundGeolocationSuccess: ['enabled'],
  stopBackgroundGeolocationFailure: ['error'],
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
  geolocationEnabled: false,
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

const startBackgroundGeolocationSuccess = (state, { geolocationEnabled }) => ({
  ...state,
  geolocationEnabled,
  error: null,
  fetching: false,
});

const stopBackgroundGeolocationSuccess = (state, { geolocationEnabled }) => ({
  ...state,
  geolocationEnabled,
  error: null,
  fetching: false,
});

const onLocationChange = (state, { location }) => ({
  ...state,
  activity: location.activity.type,
  coords: location.coords,
  isMoving: location.is_moving,
  lastLocationTimestamp: location.timestamp,
  error: null,
});

const onActivityChange = (state, { activity }) => ({ ...state, activity, error: null });

const onProviderChange = (state, { provider }) => ({ ...state, provider, error: null });

const onMotionChange = (state, { motion }) => ({
  ...state,
  activity: motion.location.activity.type,
  coords: motion.location.coords,
  isMoving: motion.isMoving,
  lastLocationTimestamp: motion.location.timestamp,
  error: null,
});

const failure = (state, { error }) => ({ ...state, fetching: false, coords: null, error });

/* ------------- Hookup Reducers To Types ------------- */
export const locationReducer = createReducer(defaultState, {
  [Types.START_BACKGROUND_GEOLOCATION]: request,
  [Types.START_BACKGROUND_GEOLOCATION_SUCCESS]: startBackgroundGeolocationSuccess,
  [Types.START_BACKGROUND_GEOLOCATION_FAILURE]: failure,
  [Types.STOP_BACKGROUND_GEOLOCATION]: request,
  [Types.STOP_BACKGROUND_GEOLOCATION_SUCCESS]: stopBackgroundGeolocationSuccess,
  [Types.STOP_BACKGROUND_GEOLOCATION_FAILURE]: failure,
  [Types.ON_LOCATION_CHANGE]: onLocationChange,
  [Types.ON_LOCATION_ERROR]: failure,
  [Types.ON_MOTION_CHANGE]: onMotionChange,
  [Types.ON_ACTIVITY_CHANGE]: onActivityChange,
  [Types.ON_PROVIDER_CHANGE]: onProviderChange,
});
