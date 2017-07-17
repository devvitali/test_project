import { firebaseAuth } from './';
import authActions from '../redux/auth';

export default function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      (authUser) => {
        if (authUser) {
          dispatch(authActions.signInFulfilled(authUser));
        }
        resolve();
        unsubscribe();
      },
      error => reject(error)
    );
  });
}
