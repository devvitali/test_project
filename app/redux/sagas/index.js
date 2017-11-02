import { all, takeEvery, takeLatest } from 'redux-saga/effects';

import { AlertTypes } from '../alert';
import { BarTypes } from '../bar';
import { DrinkupTypes } from '../drinkup';
import { AuthTypes } from '../auth';
import { LocationTypes } from '../location';
import { StartupTypes } from '../startup';

/* ------------- Sagas ------------- */
import {
  signIn,
  signOut,
  signOutSuccess,
  getOrCreateProfile,
  createProfile,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from './auth';

import {
  getDrinkup,
  startDrinkUp,
  leaveDrinkUp,
  sendRequestDrinkUp,
  cancelRequestDrinkUp,
  sendDrinkupInvitation,
  acceptDrinkupInvitation,
} from './drinkup';
import { getBars, updateMapBar } from './bar';
import { startBackgroundGeoLocation } from './location';
import { getAlerts } from './alert';
import { startup } from './startup';

/* ------------- API ------------- */
// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugSettings.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(AuthTypes.SIGN_IN, signIn),
    takeLatest(AuthTypes.SIGN_OUT, signOut),
    takeLatest(AuthTypes.SIGN_IN_FULFILLED, getOrCreateProfile),
    takeLatest(AuthTypes.SIGN_OUT_FULFILLED, signOutSuccess),
    takeLatest(AuthTypes.GET_PROFILE, getProfile),
    takeLatest(AuthTypes.CREATE_PROFILE, createProfile),
    takeLatest(AuthTypes.UPLOAD_PROFILE_PHOTO, uploadProfilePhoto),
    takeEvery(AuthTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(LocationTypes.START_BACKGROUND_GEO_LOCATION, startBackgroundGeoLocation),
    takeEvery(BarTypes.UPDATE_MAP_BAR, updateMapBar),
    takeLatest(BarTypes.BARS_REQUEST, getBars),
    takeLatest(DrinkupTypes.DRINKUP_REQUEST, getDrinkup),
    takeLatest(DrinkupTypes.START_DRINKUP, startDrinkUp),
    takeLatest(DrinkupTypes.LEAVE_DRINKUP, leaveDrinkUp),
    takeLatest(DrinkupTypes.SEND_DRINKUP_INVITATION, sendDrinkupInvitation),
    takeLatest(DrinkupTypes.SEND_REQUEST_DRINKUP, sendRequestDrinkUp),
    takeLatest(DrinkupTypes.CANCEL_REQUEST_DRINKUP, cancelRequestDrinkUp),
    takeLatest(DrinkupTypes.ACCEPT_DRINKUP_INVITATION, acceptDrinkupInvitation),
    takeLatest(AlertTypes.ALERTS_REQUEST, getAlerts),
  ]);
}
