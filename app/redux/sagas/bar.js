import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import BarActions  from '../bar';
import { Bar, BarFactory } from '../../firebase/models';
import { watch } from '../../utils/sagaUtils';
const MAP_BAR_ACTIONS = {
  onUpdate: BarActions.updateBar,
};

const MapBar = BarFactory(MAP_BAR_ACTIONS);
function barSubscribe(MapBar, keys) {
  return eventChannel(emit => MapBar.subscribeMultiple(emit, keys));
}
export function* getBars() {
  try {
    const bars = yield call([Bar, Bar.get]);
    yield put(BarActions.barsRequestSuccess(bars));
    // yield call([Bar, Bar.unsubscribe], null);
    // yield call(watch, barSubscribe, Bar, null);
  } catch (error) {
    yield put(BarActions.barsRequestFailure(error));
  }
}

export function* updateMapBar({ bars }) {
  try {
    const updateBarIds = Object.keys(bars);
    const updatedBars = yield call([Bar, Bar.gets], updateBarIds, true);
    if (updatedBars.length > 0) {
      updatedBars.forEach((item) => {
        const updatedBar = item;
        updatedBar.address.latitude = bars[updatedBar.id].latitude;
        updatedBar.address.longitude = bars[updatedBar.id].longitude;
      });
    }
    yield put(BarActions.updateMapBarSuccess(updatedBars));
    // yield call([MapBar, MapBar.unsubscribeKeys], Object.keys(bars));
    // yield call(watch, barSubscribe, MapBar, addedBarsId);
  } catch (error) {
    console.log('updateMapBarFailure err', error);
    yield put(BarActions.updateMapBarFailure(error));
  }
}
