import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  alertsRequest: [],
  alertsSuccess: ['alerts'],
  alertsFailure: ['error'],
  markAlertAsRead: ['alert'],
});

export const AlertTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
const defaultState = {
  alerts: {},
  fetching: null,
  error: null,
};

/* ------------- Reducers ------------- */
const request = state => ({ ...state, fetching: true });
const success = (state, { alerts }) => ({ ...state, alerts, fetching: false });
const failure = (state, { error }) => ({ ...state, error, alerts: null });
const readAlert = (state, { alert }) => {
  const alerts = { ...state.alerts };
  alerts[alert.id].read = true;
  return { ...state, alerts };
};

/* ------------- Hookup Reducers To Types ------------- */

export const alertReducer = createReducer(defaultState, {
  [Types.ALERTS_REQUEST]: request,
  [Types.ALERTS_SUCCESS]: success,
  [Types.ALERTS_FAILURE]: failure,
  [Types.MARK_ALERT_AS_READ]: readAlert,
});
