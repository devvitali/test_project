import { combineReducers } from 'redux';
import { connect } from 'react-redux';
import configureStore from './createStore';
import rootSaga from './sagas';

import { User } from '../firebase/models';
import AuthActions, { authReducer as auth } from './auth';
import DrawerActions, { sidebarReducer as drawer } from './sidebar';
import LocationActions, { locationReducer as location } from './location';
import AlertActions, { alertReducer as alert } from './alert';
import DrinkupActions, { drinkupReducer as drinkup } from './drinkup';
import BarActions, { barReducer as bar } from './bar';

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    alert,
    auth,
    drawer,
    location,
    bar,
    drinkup,
  });
  return configureStore(rootReducer, rootSaga);
};

const mapDispatchToProps = dispatch => ({
  actions: {
    signOut: () => dispatch(AuthActions.signOut()),
    signIn: () => dispatch(AuthActions.signIn()),
    updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
    uploadProfilePhoto: photo => dispatch(AuthActions.uploadProfilePhoto(photo)),

    openDrawer: () => dispatch(DrawerActions.openDrawer()),
    closeDrawer: () => dispatch(DrawerActions.closeDrawer()),
    setActivePage: page => dispatch(DrawerActions.setActivePage(page)),
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
export { DrawerActions };
export { AlertActions };
export { LocationActions };
export { DrinkupActions };
export { BarActions };
