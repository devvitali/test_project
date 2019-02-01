import _ from 'lodash';
import { getDistance } from 'geolib';
import Base from './base';

export default class Bar extends Base {
  constructor(db, actions) {
    super(db, actions);
    this.ref = 'bars';
  }

  static getBarsSortedByDistance(locationCoords, bars) {
    const arrayBars = [];
    _.each(bars, (bar, key) => {
      arrayBars.push({ ...bar, key });
    });
    const getBarValue = (bar) => {
      if (bar.currentDrinkUp && bar.specialId) {
        return 0;
      }
      if (bar.currentDrinkUp) {
        return 1;
      }
      if (bar.specialId) {
        return 2;
      }
      return 3;
    };
    arrayBars.sort((bar1, bar2) => {
      const bar1Value = getBarValue(bar1);
      const bar2Value = getBarValue(bar2);
      if (bar1Value === bar2Value) {
        const { latitude, longitude, accuracy } = locationCoords;
        const start = { latitude, longitude };
        const bar1Distance = getDistance(start, bar1.address, accuracy);
        const bar2Distance = getDistance(start, bar2.address, accuracy);
        return bar1Distance - bar2Distance;
      }
      return bar1Value - bar2Value;
    });
    return arrayBars.map(item => bars[item.key]);
  }

}
