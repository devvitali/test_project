import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import BarActions  from '../bar';
import { Bar, BarFactory } from '../../firebase/models';
import { watch } from '../../utils/sagaUtils';

const MAP_BAR_ACTIONS = {
  onUpdate: BarActions.updateBar,
};

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
    const MapBar = BarFactory(MAP_BAR_ACTIONS);
    const addedBarsId = Object.keys(bars).filter(key => bars[key].type === 'add');
    const removedBarsId = Object.keys(bars).filter(key => bars[key].type !== 'add');
    const addedBars = yield call([Bar, Bar.gets], addedBarsId, true);
    if (addedBars.length > 0) {
      addedBars.forEach((addedBar) => {
        addedBar.address.latitude = bars[addedBar.id].location[0];
        addedBar.address.longitude = bars[addedBar.id].location[1];
      });
    }
    yield put(BarActions.updateMapBarSuccess(addedBars, removedBarsId));
    yield call([MapBar, MapBar.unsubscribeKeys], Object.keys(bars));
    yield call(watch, barSubscribe, MapBar, addedBarsId);
  } catch (error) {
    console.log('updateMapBarFailure err', error);
    yield put(BarActions.updateMapBarFailure(error));
  }
}
