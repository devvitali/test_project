import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistCombineReducers } from 'redux-persist';
import configureStore from './createStore';
import rootSaga from './sagas';
import AuthActions, { authReducer as auth } from './auth';
import LocationActions, { locationReducer as location } from './location';
import AlertActions, { alertReducer as alert } from './alert';
import DrinkupActions, { drinkupReducer as drinkup } from './drinkup';
import BarActions, { barReducer as bar } from './bar';
import { isUserValid } from '../utils/auth';

const config = {
  key: 'root',
  storage,
  blacklist: ['login', 'search'],
};
export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = persistCombineReducers(config, {
    alert,
    auth,
    location,
    bar,
    drinkup,
  });
  return configureStore(rootReducer, rootSaga);
};

const mapDispatchToProps = dispatch => ({
  actions: {
    signOut: (navigation, uid, bar) => dispatch(AuthActions.signOut(navigation, uid, bar)),
    signIn: () => dispatch(AuthActions.signIn()),
    updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
    uploadProfilePhoto: photo => dispatch(AuthActions.uploadProfilePhoto(photo)),
    startBackgroundGeoLocation: () => dispatch(LocationActions.startBackgroundGeoLocation()),
  },
});

export function Connect(component, mapStateToProps) {
  if (!mapStateToProps) {
    // eslint-disable-next-line no-param-reassign
    mapStateToProps = state => ({
      auth: state.auth,
      isUserValid: isUserValid(state.auth.profile),
    });
  }
  return connect(mapStateToProps, mapDispatchToProps)(component);
}

export { AuthActions };
export { AlertActions };
export { LocationActions };
export { DrinkupActions };
export { BarActions };
