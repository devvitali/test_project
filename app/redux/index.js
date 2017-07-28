import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import configureStore from './createStore';
import rootSaga from './sagas';

import { User } from '../firebase/models';
import AuthActions, { authReducer as auth } from './auth';
import LocationActions, { locationReducer as location } from './location';
import AlertActions, { alertReducer as alert } from './alert';
import DrinkupActions, { drinkupReducer as drinkup } from './drinkup';
import BarActions, { barReducer as bar } from './bar';

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
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
    signOut: navigation => dispatch(AuthActions.signOut(navigation)),
    signIn: () => dispatch(AuthActions.signIn()),
    updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
    uploadProfilePhoto: photo => dispatch(AuthActions.uploadProfilePhoto(photo)),
    startBackgroundGeolocation: () => dispatch(LocationActions.startBackgroundGeolocation()),
  },
});

export function Connect(component, mapStateToProps) {
  if (!mapStateToProps) {
    // eslint-disable-next-line no-param-reassign
    mapStateToProps = state => ({
      auth: state.auth,
      isUserValid: User.isUserValid(state.auth.profile),
    });
  }
  return connect(mapStateToProps, mapDispatchToProps)(component);
}

export { AuthActions };
export { AlertActions };
export { LocationActions };
export { DrinkupActions };
export { BarActions };
