import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { CachedImage } from 'react-native-cached-image';
import ImageZoom from 'react-native-image-pan-zoom';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Metrics } from '../../themes';

const styles = StyleSheet.create({
  swiper: {
    height: 200,
    flex: -1,
  },
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 7,
    marginRight: 7,
    borderColor: '#333',
    borderWidth: 1,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: '#333',
    borderWidth: 1,
    marginLeft: 7,
    marginRight: 7,
  },
  barImage: {
    height: 200,
    width: Metrics.screenWidth,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export class BarImages extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeImage: null,
    };
  }
  render() {
    if (!this.props.images || this.props.images.length === 0) {
      return null;
    }
    return (
      <View>
        {this.state.activeImage &&
        <Modal transparent>
          <View style={styles.modalContainer}>
            <ImageZoom
              cropWidth={Metrics.screenWidth}
              cropHeight={Metrics.screenHeight}
              imageWidth={300}
              imageHeight={300}
            >
              <CachedImage
                source={{ uri: this.state.activeImage }}
                style={styles.image}
                resizeMode="contain"
                activityIndicatorProps={{ size: 'large' }}
              />
            </ImageZoom>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => this.setState({ activeImage: null })}
            >
              <Icon name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Modal>
        }
        <Swiper
          containerStyle={styles.swiper}
          height={200}
          paginationStyle={{ bottom: 10 }}
          dot={<View style={styles.dotStyle} />}
          activeDot={<View style={styles.activeDotStyle} />}
        >
          {this.props.images.map((image, id) => (
            <TouchableOpacity key={id} onPress={() => this.setState({ activeImage: image })}>
              <CachedImage resizeMode="stretch" style={styles.barImage} source={{ uri: image }} />
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>
    );
  }
}
