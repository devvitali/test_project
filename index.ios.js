import { AppRegistry } from 'react-native';
import 'react-devtools';
import './app/config/reactotronConfig';
import './app/config/analytics';
// eslint-disable-next-line import/first
import App from './app/app';

AppRegistry.registerComponent('ALKO', () => App);
