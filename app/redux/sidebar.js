import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  openDrawer: null,
  closeDrawer: null,
  setActivePage: ['page'],
});

export const DrawerTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
const defaultState = {
  show: false,
  active: 'map',
};

/* ------------- Reducers ------------- */

function mapState(generateNewState) {
  return (state, action) => {
    const data = generateNewState(state, action);
    return Object.assign({}, state, data);
  };
}

const openDrawer = mapState(() => ({ show: true }));
const closeDrawer = mapState(() => ({ show: false }));
const setActivePage = mapState((state, { page }) => ({ page }));

/* ------------- Hookup Reducers To Types ------------- */

export const sidebarReducer = createReducer(defaultState, {
  [Types.OPEN_DRAWER]: openDrawer,
  [Types.CLOSE_DRAWER]: closeDrawer,
  [Types.SET_ACTIVE_PAGE]: setActivePage,
});
