import GeoFire from 'geofire';
import firebase from 'react-native-firebase';

export const firebaseAnalytics = firebase.analytics();
export const firebaseAuth = firebase.auth();
export const firebaseConfig = firebase.config();
export const firebaseDb = firebase.database();
export const firebaseStorage = firebase.storage();

export const geoFire = key => new GeoFire(firebaseDb.ref(key));
