import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { pick } from 'lodash';
import { watch } from '../../utils/sagaUtils';
import DrinkupActions from '../drinkup';
import { Bar, DrinkUp } from '../../firebase/models';

const DRINKUP_USER_PROPERTIES = ['photoURL', 'firstName', 'icon', 'message'];
function drinkupSubscribe(Drinkup, key) {
  return eventChannel(emit => Drinkup.subscribe(emit, key));
}
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
    yield put(DrinkupActions.drinkupRequestSuccessful(drinkup, joined, waitingInvite, waitingUsers));
    yield call([DrinkUp, DrinkUp.unsubscribe], null);
    yield call(watch, drinkupSubscribe, DrinkUp, null);
  } catch (error) {
    console.log('err', error);
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
    const bar = yield call([Bar, Bar.get], barId);
    console.log('startDrinkUp', drinkupSnap.val(), bar);
    yield put(DrinkupActions.startDrinkupSuccessful(drinkupSnap.val(), bar));
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
    yield put(DrinkupActions.leaveDrinkupSuccessful());
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
export function* cancelRequestDrinkUp({ bar, user }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    const waitingUsers = drinkup.waitingUsers ? { ...drinkup.waitingUsers } : {};
    delete waitingUsers[user.uid];
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { waitingUsers });
    yield put(DrinkupActions.cancelRequestDrinkupSuccessful());
  } catch (err) {
    yield put(DrinkupActions.cancelRequestDrinkupFailure(err));
  }
}

export function* sendDrinkupInvitation({ bar, user }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    const waitingUsers = drinkup.waitingUsers ? { ...drinkup.waitingUsers } : {};
    delete waitingUsers[user.uid];
    const users = drinkup.users ? { ...drinkup.users } : {};
    users[user.uid] = pick(user, DRINKUP_USER_PROPERTIES);
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { waitingUsers, users });
    yield put(DrinkupActions.sendDrinkupInvitationSucessful(users, waitingUsers));
  } catch (err) {
    yield put(DrinkupActions.sendDrinkupInvitationFailure(err));
  }
}
