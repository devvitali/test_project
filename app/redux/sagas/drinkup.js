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

export function* getDrinkup({ drinkupId }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], drinkupId);
    yield put(DrinkupActions.drinkupRequestSuccessful(drinkup));
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
    const users = [...drinkup.users];
    const joinedUsers = drinkup.joinedUsers ? { ...drinkup.joinedUsers } : {};
    delete users[user.uid];
    let active = true;
    if (users && Object.keys(users).length === 0) {
      active = false;
      yield call([Bar, Bar.update], bar.id, { currentDrinkUp: null });
    }
    joinedUsers[user.uid] = user;
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users, joinedUsers, active });
    yield put(DrinkupActions.leaveDrinkupSuccessful(users));
  } catch (error) {
    yield put(DrinkupActions.leaveDrinkupFailure(error));
  }
}
