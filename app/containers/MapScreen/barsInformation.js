import { AsyncStorage } from 'react-native';
import { BarFactory } from '../../firebase/models';
import { calculateZoom, hasLocation } from '../../utils/mapUtils';
import { getClusters } from '../../utils/clustering';

function setBarAddress(_bar, location) {
  const bar = _bar;
  if (!bar.address) {
    bar.address = {};
  }
  bar.address.latitude = location[0];
  bar.address.longitude = location[1];
  return bar;
}
class BarInformation {
  constructor() {
    this.bars = {};
    this.callback = null;
    setTimeout(async () => {
      await this.getBars();
    }, 10);
    this.barActions = {
      onUpdate: this.onUpdate,
    };
    this.subscribedKeys = [];
    this.barModel = new BarFactory();
    this.barSubscribeModel = new BarFactory(this.barActions);
    this.enteredBarCount = 0;
    this.callbackCount = 0;
  }
  onBarEntered = async (barId, location) => {
    this.enteredBarCount += 1;
    if (!this.bars[barId]) {
      const bar = await this.barModel.get(barId, true);
      this.bars[barId] = { ...setBarAddress(bar, location), location };
    }
    this.barSubscribeModel.unsubscribe(barId);
    this.barSubscribeModel.subscribe(() => {}, barId);
    if (this.enteredBarCount === 0) {
      setTimeout(() => {
        this.enteredBarCount -= 1;
        if (this.enteredBarCount === 0) {
          this.callback();
        }
        this.saveBars();
      }, 100);
    }
    this.subscribedKeys.push(barId);
  };
  onUpdate = (bar, barId) => {
    const oldBar = this.bars[barId];
    if (this.bars[barId]) {
      const { location } = this.bars[barId];
      this.bars[barId] = { ...setBarAddress(bar, location), location };
      this.bars[barId].id = barId;
    }
    const oldJson = !oldBar ? '' : JSON.stringify(oldBar, Object.keys(oldBar).sort());
    const newJson = !this.bars[barId] ? '' : JSON.stringify(this.bars[barId], Object.keys(this.bars[barId]).sort());
    if (oldJson !== newJson) {
      this.callbackCount += 1;
      this.saveBars();
      setTimeout(() => {
        this.callbackCount -= 1;
        if (this.callbackCount === 0) {
          this.callback();
        }
      }, 100);
    }
  };
  setCallback = callback => this.callback = callback;
  async saveBars() {
    const keys = Object.keys(this.bars);
    if (keys.length > 0) {
      keys.forEach((key) => {
        try {
          AsyncStorage.setItem(`bar-${key}`, JSON.stringify(this.bars[key]));
        } catch (err) {
          console.log('error on save', this.bars[key], key);
        }
      });
      AsyncStorage.setItem('bar-keys', JSON.stringify(keys));
    }
  }
  async getBars() {
    const strKeys = await AsyncStorage.getItem('bar-keys');
    if (strKeys) {
      const keys = JSON.parse(strKeys);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        // eslint-disable-next-line
        const strBar = await AsyncStorage.getItem(key);
        this.bars[key] = JSON.parse(strBar);
      }
    }
    if (this.callback) {
      this.callback();
    }
  }
  getBarsCount(region) {
    return this.getBarsFromRegion({ ...region, latitudeDelta: 0.05, longitudeDelta: 0.05  }).length;
  }
  async getBar(barId) {
    if (this.bars[barId]) {
      return this.bars[barId];
    }
    return this.barModel.get(barId, true);
  }
  getBarsFromRegion(region) {
    const ret = [];
    Object.keys(this.bars).forEach((key) => {
      if (this.bars[key] && hasLocation(this.bars[key].address, region)) {
        this.bars[key].id = key;
        ret.push(this.bars[key]);
      }
    });
    return ret;
  }
  async subscribeBars(region) {
    const bars = this.getBarsFromRegion(region);
    const barIds = bars.map(bar => bar.id);
    if (this.subscribedKeys) {
      this.barSubscribeModel.unsubscribeKeys(this.subscribedKeys);
    }
    this.subscribedKeys = [];
    const result = await this.barModel.gets(barIds, true);
    result.forEach((bar) => {
      if (!bar.removed) {
        if (this.bars[bar.id]) {
          const { location } = this.bars[bar.id];
          this.bars[bar.id] = { ...setBarAddress(bar, location), location };
        }
        this.subscribedKeys.push(bar.id);
      } else {
        delete this.bars[bar.id];
      }
    });
    this.barSubscribeModel.subscribeMultiple(() => {}, this.subscribedKeys);
    if (this.callback) {
      this.callback();
    }
  }
  getBarMarkers(region, location) {
    let markerBarItems = [];
    let clusterMarkers = [];
    let barResultItems = [];
    if (region && location) {
      barResultItems = this.getBarsFromRegion(region);
      if (location) {
        barResultItems = this.barModel.constructor.getBarsSortedByDistance(location, barResultItems);
      }
      const clusterInputBars = {};
      markerBarItems = [];
      barResultItems.forEach((bar) => {
        if (bar.currentDrinkUp || bar.specialId) {
          markerBarItems.push(bar);
        } else {
          clusterInputBars[bar.id] = bar;
        }
      });
      const clusters = getClusters(clusterInputBars, calculateZoom(region.longitudeDelta));
      clusterMarkers = [];
      clusters.forEach(({ properties, geometry }) => {
        if (properties.cluster) {
          clusterMarkers.push({
            count: properties.point_count,
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
          });
        } else {
          markerBarItems.push(clusterInputBars[properties.id]);
        }
      });
    }
    return {
      markerBarItems,
      clusterMarkers,
      barResultItems,
    };
  }
}

export const BarsInformation = new BarInformation();
