import { call, put, take } from 'redux-saga/effects';

export function* watch(subscribe, ...params) {
  const channel = yield call(subscribe, ...params);
  const loop = true;
  while (loop) {
    const action = yield take(channel);
    yield put(action);
  }
}