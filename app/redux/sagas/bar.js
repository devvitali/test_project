import { put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import BarActions, { BAR_CACHE } from '../bar';
import { Bar, BarFactory } from '../../firebase/models';
import { watch } from '../../utils/sagaUtils';

const MAP_BAR_ACTIONS = {
  onAdd: BarActions.updateBar,
  onChange: BarActions.updateBar,
  onLoad: BarActions.addBarSuccess,
  onRemove: BarActions.removeBarProperty,
};

function barSubscribe(MapBar, key) {
  return eventChannel(emit => MapBar.subscribe(emit, key));
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
    const addedBarsId = Object.keys(bars).filter(key => bars[key].type === 'add');
    const removedBarsId = Object.keys(bars).filter(key => bars[key].type !== 'add');
    Object.keys(bars).map(key => call([Bar, Bar.unsubscribe], key));
    const addedBars = yield call([Bar, Bar.gets], addedBarsId, true);
    if (addedBars.length > 0) {
      addedBars.forEach((addedBar) => {
        addedBar.address.latitude = bars[addedBar.id].location[0];
        addedBar.address.longitude = bars[addedBar.id].location[1];
      });
    }
    addedBarsId.map(key => call(watch, barSubscribe, Bar, key));
    yield put(BarActions.updateMapBarSuccess(addedBars, removedBarsId));
  } catch (error) {
    console.log('updateMapBarFailure err', error);
    yield put(BarActions.updateMapBarFailure(error));
  }
}
