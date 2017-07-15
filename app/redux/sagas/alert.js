import { put } from 'redux-saga/effects';
import AlertActions from '../alert';
import alerts from '../../fixture/alerts.json';

export function* getAlerts() {
  try {
    yield put(AlertActions.alertsSuccess(alerts));
  } catch (error) {
    yield put(AlertActions.alertsFailure(error));
  }
}
