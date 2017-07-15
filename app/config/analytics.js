import { Platform } from 'react-native';
import { firebaseAnalytics } from '../firebase';

console.track = (name, payload = {}) => {
  console.tron.display({
    name: 'Analytics',
    value: { name, payload },
    important: true,
  });

  firebaseAnalytics.logEventWithName(name, { payload: Platform.OS === 'ios' ? payload : JSON.stringify(payload) });
};
