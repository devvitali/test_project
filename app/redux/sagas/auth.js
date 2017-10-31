import { call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import authActions from '../auth';
import { firebaseAuth, firebaseStorage } from '../../firebase';
import { User } from '../../firebase/models';
import { watch } from '../../utils/sagaUtils';

function subscribe(key) {
  return eventChannel(emit => User.subscribe(emit, key));
}

export function* signIn() {
  try {
    const authData = yield call([firebaseAuth, firebaseAuth.signInAnonymously]);
    yield put(authActions.signInFulfilled(authData));
  } catch (error) {
    yield put(authActions.signInFailed(error));
  }
}

export function* signOut(navigation) {
  try {
    const authData = firebaseAuth.currentUser;
    yield call([User, User.unsubscribe], authData.uid);
    yield call([User, User.remove], authData.uid);
    yield put(authActions.signOutFulfilled(navigation));
  } catch (error) {
    yield put(authActions.signOutFailed(error, navigation));
  }
}

export function* signOutSuccess(navigation) {
  yield call([navigation, navigation.navigation.navigation.navigate], 'OnBoardingStep1');
}

export function* getOrCreateProfile() {
  try {
    const authData = firebaseAuth.currentUser;
    const userExists = yield call([User, User.exists], authData.uid);
    if (userExists) {
      yield put(authActions.getProfile(authData));
    } else {
      yield put(authActions.createProfile(authData));
    }
  } catch (error) {
    yield put(authActions.getProfileFailed(error));
  }
}

export function* getProfile() {
  try {
    const authData = firebaseAuth.currentUser;
    yield call(watch, subscribe, authData.uid);
  } catch (error) {
    yield put(authActions.getProfileFailed(error));
  }
}

export function* createProfile() {
  try {
    const authData = firebaseAuth.currentUser;
    yield call([User, User.set], authData.uid, { uid: authData.uid });
    yield put(authActions.createProfileFulfilled());
    yield call(watch, subscribe, authData.uid);
  } catch (error) {
    yield put(authActions.createProfileFailed(error));
  }
}

export function* updateProfile({ diff }) {
  try {
    const authData = yield call([firebaseAuth, firebaseAuth.signInAnonymously]);
    yield call([User, User.update], authData.uid, diff);
    yield call(watch, subscribe, authData.uid);
  } catch (error) {
    yield put(authActions.updateProfileFailed(error));
  }
}

export function* uploadProfilePhoto({ photo }) {
  try {
    yield put(authActions.updateProfileFulfilled({ photoURL: photo.path }));
    const authData = yield call([firebaseAuth, firebaseAuth.signInAnonymously]);
    const storageOpts = { contentType: 'image/jpeg', contentEncoding: 'base64' };
    const filename = photo.path.replace(/^.*[\\/]/, '');
    const storageRef = firebaseStorage.ref(`photos/${authData.uid}/${filename}`);
    const res = yield call([storageRef, storageRef.put], photo.path, storageOpts);
    yield call([User, User.update], authData.uid, { photoURL: res.downloadUrl });
    yield put(authActions.uploadProfilePhotoFulfilled());
  } catch (error) {
    yield put(authActions.uploadProfilePhotoFailed(error));
  }
}
