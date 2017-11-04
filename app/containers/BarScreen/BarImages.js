import React from 'react';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { CachedImage } from 'react-native-cached-image';
import { Metrics } from '../../themes';

const styles = StyleSheet.create({
  swiper: {
    height: 200,
    flex: -1,
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  barImage: {
    height: 200,
    width: Metrics.screenWidth,
  },
})
export const BarImages = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }
  return (
    <Swiper
      containerStyle={styles.swiper}
      height={200}
      dot={<View style={styles.dotStyle} />}
      activeDot={<View style={styles.activeDotStyle} />}
    >
      {images.map((image, id) => (
        <CachedImage key={id} resizeMode="stretch" style={styles.barImage} source={{ uri: image }} />
      ))}
    </Swiper>
  );
}

