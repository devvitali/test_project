import { createReducer, createActions } from 'reduxsauce';
import { omit } from 'lodash';
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  barsRequest: [],
  barsRequestSuccess: ['bars'],
  barsRequestFailure: ['error'],
  addBar: ['barId'],
  addBarSuccess: ['bar', 'barId'],
  addBarFailure: ['error'],
  updateBar: ['bar', 'barId'],
  removeBar: ['barId'],
  removeBarProperty: ['value', 'name', 'barId'],
  clearBars: [],
});

export const BarTypes = Types;
export default Creators;
/* ------------- Initial State ------------- */
const defaultState = {
  bars: {},
  fetching: false,
  error: null,
};
/* ------------- Reducers ------------- */
const request = state => ({ ...state, fetching: true });
const barsRequestSuccess = (state, { bars }) => ({ ...state, fetching: false, bars });
const barsRequestFailure = (state, { error }) => ({ ...state, bars: null, fetching: false, error });
const updateBar = (state, { bar, barId }) => {
  const updatedBar = Object.assign({}, state.bars[barId], bar);
  if (Object.keys(updatedBar).length <= 0) {
    return Object.assign({}, state, {
      bars: omit(state.bars, barId),
    });
  }

  return Object.assign({}, state, {
    bars: Object.assign({}, state.bars, {
      [barId]: Object.assign({}, state.bars[barId], bar),
    }),
  });
};

const addBarFailure = (state, { error }) => ({ ...state, fetching: false, error });
const removeBar = (state, { barId }) => ({ ...state, bars: omit(state.bars, barId) });
const clearBars = state => ({ ...state, bars: {} });
const removeBarProperty = (state, { name, barId }) => {
  const updatedBar = omit(state.bars[barId], name);
  if (Object.keys(updatedBar).length <= 0) {
    return { ...state, bars: omit(state.bars, barId) };
  }
  return {
    ...state,
    bars: { ...state.bars, [barId]: omit(state.bars[barId], name) },
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const barReducer = createReducer(defaultState, {
  [Types.BARS_REQUEST]: request,
  [Types.BARS_REQUEST_SUCCESS]: barsRequestSuccess,
  [Types.BARS_REQUEST_FAILURE]: barsRequestFailure,
  [Types.ADD_BAR]: request,
  [Types.ADD_BAR_SUCCESS]: updateBar,
  [Types.ADD_BAR_FAILURE]: addBarFailure,
  [Types.UPDATE_BAR]: updateBar,
  [Types.REMOVE_BAR]: removeBar,
  [Types.REMOVE_BAR_PROPERTY]: removeBarProperty,
  [Types.CLEAR_BARS]: clearBars,
});
