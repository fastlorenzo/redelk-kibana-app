import {call, fork, put, takeLatest} from 'redux-saga/effects';

import {ActionType} from '../types';
import {CoreStart} from "kibana/public";

function* checkInit({http}: { http: CoreStart["http"] }) {
  try {
    const response = yield call(
      http.get, {path: '/api/redelk/init'}
    )
    yield put({type: ActionType.CONFIG_REDELK_INIT_CHECK_SUCCESS, payload: response.rawResponse});
  } catch (e) {
    console.error(e);
    yield put({type: ActionType.CONFIG_REDELK_INIT_CHECK_FAILURE, payload: e});
  }
}

function* onCheckInitWatcher() {
  yield takeLatest(ActionType.CONFIG_REDELK_INIT_CHECK as any, checkInit);
}

export default [
  fork(onCheckInitWatcher),
];
