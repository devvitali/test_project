import { createReducer, createActions } from 'reduxsauce';
import { omit } from 'lodash';

export const BAR_CACHE = {};
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  barsRequest: [],
  barsRequestSuccess: ['bars'],
  barsRequestFailure: ['error'],
  updateMapBar: ['bars'],
  updateMapBarFailure: ['error'],
  updateMapBarSuccess: ['addedBars', 'removedBars'],
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
const barsRequestSuccess = (state, { bars }) => {
  const newState = ({ ...state, fetching: false, bars: { ...state.bars, ...bars } });
  console.log('barsRequestSuccess', newState);
  return newState;
}
const barsRequestFailure = (state, { error }) => {
  const newState = ({ ...state, bars: null, fetching: false, error });
  console.log('barsRequestFailure', newState);
  return newState;
};
const updateMapBarSuccess = (state, { addedBars, removedBars }) => {
  const newState = { ...state, bars: { ...state.bars } };
  addedBars.forEach(addedBar => newState.bars[addedBar.id] = addedBar);
  removedBars.forEach(removedBarId => delete newState.bars[removedBarId]);
  return newState;
};

const updateMapBarFailure = (state, { error }) => ({ ...state, fetching: false, error });
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
  [Types.UPDATE_MAP_BAR]: request,
  [Types.UPDATE_MAP_BAR_SUCCESS]: updateMapBarSuccess,
  [Types.UPDATE_MAP_BAR_FAILURE]: updateMapBarFailure,
  [Types.REMOVE_BAR]: removeBar,
  [Types.REMOVE_BAR_PROPERTY]: removeBarProperty,
  [Types.CLEAR_BARS]: clearBars,
});
