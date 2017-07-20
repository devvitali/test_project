import { createReducer, createActions } from 'reduxsauce';
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  barRequest: ['barId'],
  barRequestSuccessful: ['bar'],
  barRequestFailure: ['error'],
  drinkupRequest: ['drinkupId', 'userId'],
  drinkupRequestSuccessful: ['drinkup', 'joined'],
  drinkupRequestFailure: ['error'],
  joinDrinkup: ['user'],
  startDrinkup: ['barId', 'user'],
  startDrinkupSuccessful: ['drinkup'],
  startDrinkupFailure: ['error'],
  leaveDrinkup: ['bar', 'user'],
  leaveDrinkupSuccessful: ['users'],
  leaveDrinkupFailure: ['error'],
  clearDrinkupData: [],
  clearDrinkupUsers: [],
});

export const DrinkupTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
const defaultState = {
  joined: null,
  bar: null,
  users: null,
  fetching: false,
};

/* ------------- Reducers ------------- */

const request = state => ({ ...state, fetching: true });
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

const drinkupRequest = state => ({ ...state, fetching: true });
const drinkupRequestSuccessful = (state, { drinkup: { users }, joined }) => ({
  ...state,
  fetching: false,
  users,
  joined,
});

const startDrinkupSuccessful = (state, { drinkup: { users } }) => ({
  ...state,
  joined: true,
  fetching: false,
  users,
});

const drinkupRequestFailure = (state, { error }) => ({
  ...state,
  fetching: false,
  users: null,
  error,
});

const joinDrinkup = (state, { user }) => ({
  ...state,
  joined: true,
  users: ({ ...state.users, newUser: user }),
});

const leaveDrinkupSuccessful = (state, { users }) => ({
  ...state,
  joined: false,
  fetch: false,
  users,
});

const leaveRequestFailure = (state, { error }) => ({
  ...state,
  fetching: false,
  error,
});
const clearDrinkupUsers = state => ({ ...state, users: null });
const clearDrinkupData = () => defaultState;

/* ------------- Hookup Reducers To Types ------------- */
export const drinkupReducer = createReducer(defaultState, {
  [Types.BAR_REQUEST]: request,
  [Types.BAR_REQUEST_SUCCESSFUL]: barRequestSuccessful,
  [Types.BAR_REQUEST_FAILURE]: barRequestFailure,
  [Types.DRINKUP_REQUEST]: drinkupRequest,
  [Types.DRINKUP_REQUEST_SUCCESSFUL]: drinkupRequestSuccessful,
  [Types.DRINKUP_REQUEST_FAILURE]: drinkupRequestFailure,
  [Types.START_DRINKUP]: request,
  [Types.START_DRINKUP_SUCCESSFUL]: startDrinkupSuccessful,
  [Types.START_DRINKUP_FAILURE]: drinkupRequestFailure,
  [Types.JOIN_DRINKUP]: joinDrinkup,
  [Types.LEAVE_DRINKUP]: request,
  [Types.LEAVE_DRINKUP_SUCCESSFUL]: leaveDrinkupSuccessful,
  [Types.LEAVE_DRINKUP_FAILURE]: leaveRequestFailure,
  [Types.CLEAR_DRINKUP_DATA]: clearDrinkupData,
  [Types.CLEAR_DRINKUP_USERS]: clearDrinkupUsers,
});
