// Utility functions
import { Platform, StyleSheet } from 'react-native';
import R from 'ramda';

// useful cleaning functions
const nullToEmpty = R.defaultTo('');
const replaceEscapedCRLF = R.replace(/\\n/g);
const nullifyNewlines = R.compose(replaceEscapedCRLF(' '), nullToEmpty);

// Correct Map URIs
export const locationURL = (address: string) => {
  const cleanAddress = nullifyNewlines(address);
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') {
    return `http://maps.google.com/?q=${cleanAddress}`;
  }
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  return `http://maps.apple.com/?address=${cleanAddress}`;
};

export const directionsURL = (address: string) => {
  const cleanAddress = nullifyNewlines(address);
  // https://developers.google.com/maps/documentation/ios-sdk/urlscheme
  if (Platform.OS === 'android') {
    return `http://maps.google.com/?daddr=${cleanAddress}`;
  }
  // https://developer.apple.com/library/ios/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
  return `http://maps.apple.com/?daddr=${cleanAddress}&dirflg=d`;
};

export const applyComponentTheme = (theme, props) => {
  const flatTheme = {};
  const flatProps = {};

  Object.keys(theme).forEach((key) => {
    if (typeof theme[key] === 'number' && key.toLowerCase().indexOf('style') > -1) {
      flatTheme[key] = StyleSheet.flatten(theme[key]);
    } else {
      flatTheme[key] = theme[key];
    }
  });

  Object.keys(props).forEach((key) => {
    if (typeof props[key] === 'number' && key.toLowerCase().indexOf('style') > -1) {
      flatProps[key] = StyleSheet.flatten(props[key]);
    } else {
      flatProps[key] = props[key];
    }
  });
  return { ...flatTheme, ...flatProps };
  // return _.merge({}, flatTheme, flatProps);
};
