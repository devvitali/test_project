import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { pick } from 'lodash';
import { watch } from '../../utils/sagaUtils';
import DrinkupActions from '../drinkup';
import { Bar, DrinkUp, Notification } from '../../firebase/models';

const DRINKUP_USER_PROPERTIES = ['photoURL', 'firstName', 'icon', 'message', 'invitedBy', 'messagesRead', 'fcmToken'];

function drinkupSubscribe(Drinkup, key) {
  return eventChannel(emit => Drinkup.subscribe(emit, key));
}

export function* getDrinkup({ drinkupId, userId }) {
  try {
    console.log('getDrinkup');
    const drinkup = yield call([DrinkUp, DrinkUp.get], drinkupId);
    if (!drinkup.users) {
      drinkup.users = {};
    }
    if (!drinkup.waitingUsers) {
      drinkup.waitingUsers = {};
    }
    const users = drinkup.users;
    const waitingUsers = drinkup.waitingUsers || {};
    const joined = !!users[userId];
    const waitingInvite = !!waitingUsers[userId];
    yield put(DrinkupActions.drinkupRequestSuccessful(drinkup, joined, waitingInvite, waitingUsers, userId));
    yield call([DrinkUp, DrinkUp.unsubscribe], drinkupId);
    yield call(watch, drinkupSubscribe, DrinkUp, drinkupId);
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
    const drinkupSnap = yield call([DrinkUp, DrinkUp.push], drinkup);
    yield call([Bar, Bar.update], barId, { currentDrinkUp: drinkupSnap.key });
    const bar = yield call([Bar, Bar.get], barId);
    bar.id = barId;
    console.log('startDrinkUp', drinkupSnap.val(), bar);
    yield put(DrinkupActions.startDrinkupSuccessful(drinkupSnap.val(), bar));
    yield call(watch, drinkupSubscribe, DrinkUp, drinkupSnap.key);
  } catch (error) {
    yield put(DrinkupActions.drinkupRequestFailure(error));
  }
}

export function* leaveDrinkUp({ bar, user }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    let users = drinkup.users ? { ...drinkup.users } : {};
    const leavedUsers = drinkup.leavedUsers ? { ...drinkup.leavedUsers } : {};
    delete users[user.uid];
    let active = true;
    if (users && Object.keys(users).length === 0) {
      active = false;
      users = {};
      yield call([Bar, Bar.update], bar.id, { currentDrinkUp: null });
    }
    leavedUsers[user.uid] = '';
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users, leavedUsers, active });
    yield put(DrinkupActions.leaveDrinkupSuccessful());
    yield call([DrinkUp, DrinkUp.unsubscribe], bar.currentDrinkUp);
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
    const notification = {
      type: 'JOIN_DRINKUP_REQUEST',
      drinkupId: bar.currentDrinkUp,
      user,
    };
    yield call([Notification, Notification.push], notification);
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
    const notification = {
      type: 'ACCEPT_DRINKUP_REQUEST',
      barName: bar.name,
      fcmToken: user.fcmToken,
      message: user.message,
    };
    yield call([Notification, Notification.push], notification);
    yield put(DrinkupActions.sendDrinkupInvitationSucessful(users, waitingUsers));

  } catch (err) {
    yield put(DrinkupActions.sendDrinkupInvitationFailure(err));
  }
}
export function* acceptDrinkupInvitation({ bar, uid }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], bar.currentDrinkUp);
    const users = drinkup.users ? { ...drinkup.users } : {};
    if (users[uid]) {
      users[uid].messagesRead = true;
    }
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users });
  } catch (err) {
    yield put(DrinkupActions.sendDrinkupInvitationFailure(err));
  }
}
