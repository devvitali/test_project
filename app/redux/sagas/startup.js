import { call, put, select } from 'redux-saga/effects';
import { is } from 'ramda';

import { firebaseAuth, firebaseDb } from '../../firebase';
import authActions from '../auth';

// process STARTUP actions

function initAuth() {
  return new Promise((resolve, reject) => {
    firebaseAuth.listenForAuth((evt) => {
      if (!evt.authenticated) {
        // There was an error or there is no user
        reject(evt.error);
      } else {
        // evt.user contains the user details
        resolve(evt.user);
      }
      firebaseAuth.unlistenForAuth();
    });
  });
}

/* eslint no-unused-vars: 0 */
export function* startup(action) {
  try {
    const authData = yield call(initAuth);
    yield put(authActions.signInFulfilled(authData));
    console.log('startup signInFulfilled', authData);
  } catch (err) {
    try {
      console.log('startup signIn');
      yield put(authActions.signIn());
    } catch (authErr) {
      console.log('startup signInFailed');
      yield put(authActions.signInFailed(authErr));
    }
  }
}
