import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { pick } from 'lodash';
import { watch } from '../../utils/sagaUtils';
import DrinkupActions from '../drinkup';
import { Bar, DrinkUp, Notification } from '../../firebase/models';

const DRINKUP_USER_PROPERTIES = ['uid', 'photoURL', 'firstName', 'icon', 'messages', 'invitedBy', 'fcmToken', 'joinedAt'];

function* drinkupSubscribe(Drinkup, key) {
  return eventChannel(emit => Drinkup.subscribe(emit, key));
}

export function* getDrinkup({ drinkupId, userId }) {
  try {
    const drinkup = yield call([DrinkUp, DrinkUp.get], drinkupId);
    if (!drinkup.users) {
      drinkup.users = {};
    }
    if (!drinkup.waitingUsers) {
      drinkup.waitingUsers = {};
    }
    const { users } = drinkup;
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
    user.joinedAt = new Date().getTime();
    const drinkup = {
      active: true,
      bar: barId,
      users: { [user.uid]: pick(user, DRINKUP_USER_PROPERTIES) },
    };
    const drinkupSnap = yield call([DrinkUp, DrinkUp.push], drinkup);
    yield call([Bar, Bar.update], barId, { currentDrinkUp: drinkupSnap.key });
    const bar = yield call([Bar, Bar.get], barId);
    bar.id = barId;
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
    const leftUsers = drinkup.leftUsers ? { ...drinkup.leftUsers } : {};
    delete users[user.uid];
    let active = true;
    if (users && Object.keys(users).length === 0) {
      active = false;
      users = {};
      yield call([Bar, Bar.update], bar.id, { currentDrinkUp: null });
    }
    leftUsers[user.uid] = '';
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users, leftUsers, active });
    yield put(DrinkupActions.leaveDrinkupSuccessful(active));
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
    user.joinedAt = new Date().getTime();
    users[user.uid] = pick(user, DRINKUP_USER_PROPERTIES);
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { waitingUsers, users });
    const notification = {
      type: 'ACCEPT_DRINKUP_REQUEST',
      barName: bar.name,
      fcmToken: user.fcmToken,
      message: user.messages[user.invitedBy].message,
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
      const { invitedBy } = users[uid];
      users[uid].messages[invitedBy].readAt = (new Date()).getTime();
    }
    yield call([DrinkUp, DrinkUp.update], bar.currentDrinkUp, { users });
  } catch (err) {
    yield put(DrinkupActions.sendDrinkupInvitationFailure(err));
  }
}
