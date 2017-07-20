import { put, call } from 'redux-saga/effects';
import { pick } from 'lodash';

import DrinkupActions from '../drinkup';
import { Bar, DrinkUp } from '../../firebase/models';

const DRINKUP_USER_PROPERTIES = ['photoURL', 'firstName', 'icon'];

export function* getBar({ barId }) {
  try {
    const drinkupBar = yield call([Bar, Bar.get], barId);
    drinkupBar.id = barId;
    yield put(DrinkupActions.barRequestSuccessful(drinkupBar));
  } catch (error) {
    yield put(DrinkupActions.barRequestFailure(error));
  }
}

export function* getDrinkup({ drinkupId, userId }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], drinkupId);
    const { users } = drinkup;
    const waitingUsers = drinkup.waitingUsers || {};
    const joined = !!users[userId];
    const waitingInvite = !!waitingUsers[userId];
    yield put(DrinkupActions.drinkupRequestSuccessful(drinkup, joined, waitingInvite));
  } catch (error) {
    yield put(DrinkupActions.drinkupRequestFailure(error));
  }
}

export function* startDrinkUp({ barId, user }) {
  try {
    const drinkup = {
      active: true,
      bar: barId,
      users: { [user.uid]: pick(user, DRINKUP_USER_PROPERTIES) },
    };
    const drinkupRef = yield call([DrinkUp, DrinkUp.push], drinkup);
    const drinkupSnap = yield call([drinkupRef, drinkupRef.once], 'value');
    yield call([Bar, Bar.update], barId, { currentDrinkUp: drinkupSnap.key });
    yield put(DrinkupActions.startDrinkupSuccessful(drinkupSnap.val()));
  } catch (error) {
    yield put(DrinkupActions.drinkupRequestFailure(error));
  }
}

export function* leaveDrinkUp({ bar, user }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    let users = [...drinkup.users];
    const leavedUsers = drinkup.leavedUsers ? { ...drinkup.leavedUsers } : {};
    delete users[user.uid];
    let active = true;
    if (users && Object.keys(users).length === 0) {
      active = false;
      users = {};
      yield call([Bar, Bar.update], bar.id, { currentDrinkUp: null });
    }
    leavedUsers[user.uid] = user;
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users, leavedUsers, active });
    yield put(DrinkupActions.leaveDrinkupSuccessful(users));
  } catch (error) {
    yield put(DrinkupActions.leaveDrinkupFailure(error));
  }
}
export function* sendRequestDrinkUp({ bar, user }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    const waitingUsers = drinkup.waitingUsers ? { ...drinkup.waitingUsers } : {};
    waitingUsers[user.uid] = user;
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { waitingUsers });
    yield put(DrinkupActions.sendRequestDrinkupSuccessful());
  } catch (err) {
    yield put(DrinkupActions.sendRequestDrinkupFailure(err));
  }
}
