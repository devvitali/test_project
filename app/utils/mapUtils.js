import R from 'ramda';
import { getDistance } from 'geolib';

export const removeEmpty = (markers: Array<Object>) =>
  R.filter(item => item && item.latitude && item.longitude, markers);
export const calculateRegion = (locations: Array<Object>, options: Object) => {
  const latPadding = options && options.latPadding ? options.latPadding : 0.1;
  const longPadding = options && options.longPadding ? options.longPadding : 0.1;
  console.log('calculateRegion', locations);
  const mapLocations = removeEmpty(locations);
  // Only do calculations if there are locations
  if (mapLocations.length > 0) {
    const allLatitudes = R.map((l) => {
      if (l.latitude && !l.latitude.isNaN) {
        return l.latitude;
      }
      return null;
    }, mapLocations);

    const allLongitudes = R.map((l) => {
      if (l.longitude && !l.longitude.isNaN) {
        return l.longitude;
      }
      return null;
    }, mapLocations);

    const minLat = R.reduce(R.min, Infinity, allLatitudes);
    const maxLat = R.reduce(R.max, -Infinity, allLatitudes);
    const minLong = R.reduce(R.min, Infinity, allLongitudes);
    const maxLong = R.reduce(R.max, -Infinity, allLongitudes);

    const middleLat = (minLat + maxLat) / 2;
    const middleLong = (minLong + maxLong) / 2;
    const latDelta = (maxLat - minLat) + latPadding;
    const longDelta = (maxLong - minLong) + longPadding;

    // return markers
    return {
      latitude: middleLat,
      longitude: middleLong,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    };
  }
  return null;
};

export const calculateZoom = delta => Math.round(Math.log(360 / delta) / Math.LN2);
export const calculateDistanceByRegion = (region) => {
  const start = {
    latitude: region.latitude - (region.latitudeDelta / 2),
    longitude: region.longitude - (region.longitudeDelta / 2),
  };
  const end = {
    latitude: region.latitude + (region.latitudeDelta / 2),
    longitude: region.longitude + (region.longitudeDelta / 2),
  };
  return getDistance(start, end) * 0.0004;
};
export const hasLocation = (location, region) => {
  const locLat = location.latitude;
  const locLon = location.longitude;
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  if (locLat > latitude - (latitudeDelta / 2) && locLat < (latitudeDelta / 2) + latitude) {
    if (locLon > longitude - (longitudeDelta / 2) && locLon < (longitudeDelta / 2) + longitude) {
      return true;
    }
  }
  return false;
};

