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

export function* addBar({ barId, location }) {
  try {
    const MapBar = BarFactory(MAP_BAR_ACTIONS);
    let bar = BAR_CACHE[barId];
    if (!bar) {
      bar = yield call([Bar, Bar.get], barId);
      bar.address.latitude = location[0];
      bar.address.longitude = location[1];
      BAR_CACHE[barId] = bar;
    }

    if (Object.keys(bar).length > 0) {
      yield call([MapBar, MapBar.unsubscribe], barId);
      yield call(watch, barSubscribe, MapBar, barId);
    }

  } catch (error) {
    yield put(BarActions.addBarFailure(error));
  }
}
