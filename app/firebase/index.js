import GeoFire from 'geofire';
import firebase from 'react-native-firebase';

// import firestack from './firestack';
// import { firebaseDb as firebaseJavscriptDb } from './firebase';

export const firebaseAuth = firebase.auth();
export const firebaseDb = firebase.database();
export const firebaseStorage = firebase.storage();

export const geoFire = key => new GeoFire(firebaseDb.ref(key));
