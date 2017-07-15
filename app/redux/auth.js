import { createReducer, createActions } from 'reduxsauce';
import { createSelector } from 'reselect';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  // Sign In Actions
  signIn: [],
  signInFulfilled: ['authUser'],
  signInFailed: ['error'],
  // Sign Out Actions
  signOut: [],
  signOutFulfilled: [],
  signOutFailed: ['error'],
  // Create Profile Actions
  createProfile: [],
  createProfileFulfilled: ['profile'],
  createProfileFailed: ['error'],
  // Get Profile Actions
  getProfile: [],
  getProfileFulfilled: ['profile'],
  getProfileFailed: ['error'],
  // Update Profile Propery Actions
  updateProfile: ['diff'],
  updateProfileFulfilled: ['diff'],
  updateProfileFailed: [],
  uploadProfilePhoto: ['photo'],
  uploadProfilePhotoFulfilled: [],
  uploadProfilePhotoFailed: ['error'],
  // Delete Profile Propery Actions
  deleteProfileFulfilled: ['diff'],
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

const defaultState = {
  profile: {},
  error: null,
  fetching: false,
  authenticated: false,
  created: false,
  uid: null,
};

/* ------------- Reducers ------------- */

const request = state => ({ ...state, fetching: true });
const signInSuccess = (state, { authUser }) => ({
  ...state,
  fetching: false,
  authenticated: true,
  uid: authUser.uid,
});
const signOutSuccess = () => ({ ...defaultState });
const profileCreated = state => ({ ...state, fetching: false, created: true });
const profileSuccess = (state, { profile }) => ({
  ...state,
  fetching: false,
  created: true,
  profile,
});
const profileUpdated = (state, { diff }) => ({ ...state, profile: { ...state.profile, ...diff } });
const profilePhotoUploaded = state => ({ ...state, fetching: false });
const profileDeleted = (state, { diff }) => {
  const profile = { ...state.profile };
  Object.keys(diff).forEach(key => delete profile[key]);
  return { ...state, profile };
};
// we've had a problem logging in
const failure = (state, { error }) => ({ ...state, fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */
export const authReducer = createReducer(defaultState, {
  [Types.SIGN_IN]: request,
  [Types.CREATE_PROFILE]: request,
  [Types.GET_PROFILE]: request,
  [Types.UPLOAD_PROFILE_PHOTO]: request,
  [Types.SIGN_OUT]: request,
  [Types.SIGN_IN_FULFILLED]: signInSuccess,
  [Types.SIGN_OUT_FULFILLED]: signOutSuccess,
  [Types.CREATE_PROFILE_FULFILLED]: profileCreated,
  [Types.GET_PROFILE_FULFILLED]: profileSuccess,
  [Types.UPDATE_PROFILE_FULFILLED]: profileUpdated,
  [Types.DELETE_PROFILE_FULFILLED]: profileDeleted,
  [Types.UPLOAD_PROFILE_PHOTO_FULFILLED]: profilePhotoUploaded,
  [Types.SIGN_IN_FAILED]: failure,
  [Types.SIGN_OUT_FAILED]: failure,
  [Types.CREATE_PROFILE_FAILED]: failure,
  [Types.GET_PROFILE_FAILED]: failure,
  [Types.UPLOAD_PROFILE_PHOTO_FAILED]: failure,
});

/* ------------- Selectors ------------- */

export const isAuthenticated = state => state.auth.authenticated;
export const getAuth = createSelector(
  state => state.auth,
  auth => auth.toJS()
);
