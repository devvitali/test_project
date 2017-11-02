import { createReducer, createActions } from 'reduxsauce';
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  barRequest: ['barId'],
  barRequestSuccessful: ['bar'],
  barRequestFailure: ['error'],
  updateDrinkupSuccess: ['drinkup'],
  drinkupRequest: ['drinkupId', 'userId'],
  drinkupRequestSuccessful: ['drinkup', 'joined', 'waitingInvite', 'waitingUsers', 'userId'],
  drinkupRequestFailure: ['error'],
  sendRequestDrinkup: ['bar', 'user'],
  sendRequestDrinkupSuccessful: [],
  sendRequestDrinkupFailure: ['error'],
  cancelRequestDrinkup: ['bar', 'user'],
  cancelRequestDrinkupSuccessful: [],
  cancelRequestDrinkupFailure: ['error'],
  startDrinkup: ['barId', 'user'],
  startDrinkupSuccessful: ['drinkup', 'bar'],
  startDrinkupFailure: ['error'],
  leaveDrinkup: ['bar', 'user'],
  leaveDrinkupSuccessful: [''],
  leaveDrinkupFailure: ['error'],
  acceptDrinkupInvitation: ['bar', 'uid'],
  sendDrinkupInvitation: ['bar', 'user', 'message'],
  sendDrinkupInvitationSuccessful: ['users', 'waitingUsers'],
  sendDrinkupInvitationFailure: ['error'],
  clearDrinkupData: [],
  clearDrinkupUsers: [],
});

export const DrinkupTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
const defaultState = {
  joined: null,
  waitingInvite: null,
  bar: null,
  users: null,
  fetching: false,
  waitingUsers: null,
  userId: null,
};

/* ------------- Reducers ------------- */

const request = state => ({ ...state, fetching: true });
const requestFailure = (state, { error }) => ({
  ...state,
  fetching: false,
  error,
});
const barRequestSuccessful = (state, { bar }) => ({
  ...state,
  fetching: false,
  bar,
});

const barRequestFailure = (state, { error }) => ({
  ...state,
  fetching: false,
  bar: null,
  error,
});
const updateDrinkupSuccess = (state, { drinkup }) => {
  if (drinkup) {
    const newState = { ...state };
    newState.users = drinkup.users || {};
    newState.waitingUsers = drinkup.waitingUsers || {};
    if (newState.users[newState.userId]) {
      newState.waitingInvite = false;
      newState.joined = true;
    }
    return newState;
  }
  return state;
};
const drinkupRequestSuccessful = (state, { drinkup: { users }, joined, waitingInvite, waitingUsers, userId }) => ({
  ...state,
  fetching: false,
  users,
  joined,
  waitingInvite,
  waitingUsers,
  userId,
});
const startDrinkupSuccessful = (state, { drinkup: { users }, bar }) => ({
  ...state,
  bar,
  joined: true,
  fetching: false,
  waitingUsers: {},
  users,
});

const drinkupRequestFailure = (state, { error }) => ({
  ...state,
  fetching: false,
  users: null,
  error,
});

const sendRequestDrinkupSuccessful = state => ({ ...state, waitingInvite: true });
const cancelRequestDrinkupSuccessful = state => ({ ...state, waitingInvite: false, users: null, waitingUsers: null });
const leaveDrinkupSuccessful = state => ({
  ...state,
  bar: null,
  joined: false,
  fetch: false,
  users: null,
  waitingUsers: null,
});
const sendDrinkupInvitationSucessful = (state, { users, waitingUsers }) => ({
  ...state,
  users,
  waitingUsers,
});
const clearDrinkupUsers = state => ({ ...state, users: null });
const clearDrinkupData = () => defaultState;

/* ------------- Hookup Reducers To Types ------------- */
export const drinkupReducer = createReducer(defaultState, {
  [Types.BAR_REQUEST]: request,
  [Types.BAR_REQUEST_SUCCESSFUL]: barRequestSuccessful,
  [Types.BAR_REQUEST_FAILURE]: barRequestFailure,
  [Types.DRINKUP_REQUEST]: request,
  [Types.UPDATE_DRINKUP_SUCCESS]: updateDrinkupSuccess,
  [Types.DRINKUP_REQUEST_SUCCESSFUL]: drinkupRequestSuccessful,
  [Types.DRINKUP_REQUEST_FAILURE]: drinkupRequestFailure,
  [Types.START_DRINKUP]: request,
  [Types.START_DRINKUP_SUCCESSFUL]: startDrinkupSuccessful,
  [Types.START_DRINKUP_FAILURE]: drinkupRequestFailure,
  [Types.SEND_REQUEST_DRINKUP]: request,
  [Types.SEND_REQUEST_DRINKUP_SUCCESSFUL]: sendRequestDrinkupSuccessful,
  [Types.SEND_REQUEST_DRINKUP_FAILURE]: requestFailure,
  [Types.CANCEL_REQUEST_DRINKUP]: request,
  [Types.CANCEL_REQUEST_DRINKUP_SUCCESSFUL]: cancelRequestDrinkupSuccessful,
  [Types.CANCEL_REQUEST_DRINKUP_FAILURE]: requestFailure,
  [Types.LEAVE_DRINKUP]: request,
  [Types.LEAVE_DRINKUP_SUCCESSFUL]: leaveDrinkupSuccessful,
  [Types.LEAVE_DRINKUP_FAILURE]: requestFailure,
  [Types.SEND_DRINKUP_INVITATION]: request,
  [Types.SEND_DRINKUP_INVITATION_SUCCESSFUL]: sendDrinkupInvitationSucessful,
  [Types.ACCEPT_DRINKUP_INVITATION]: request,
  [Types.SEND_DRINKUP_INVITATION_FAILURE]: requestFailure,
  [Types.CLEAR_DRINKUP_DATA]: clearDrinkupData,
  [Types.CLEAR_DRINKUP_USERS]: clearDrinkupUsers,
});
