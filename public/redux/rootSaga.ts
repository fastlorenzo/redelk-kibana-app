import {all} from 'redux-saga/effects';
import rtopsSaga from './rtops/rtopsSaga';
import configSaga from "./config/configSaga";

export default function* rootSaga() {
  yield all([
    ...configSaga,
    ...rtopsSaga
  ]);
}
