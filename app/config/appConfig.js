import { NativeModules } from 'react-native';
import '../i18n';

const appVersion = NativeModules.RNUeno;

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  ...appVersion,
};

