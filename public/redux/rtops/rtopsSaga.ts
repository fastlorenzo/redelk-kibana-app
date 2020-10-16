import {call, fork, put, takeLatest} from 'redux-saga/effects';

import {ActionType, CreateIOCType} from '../types';
import {
  DataPublicPluginStart,
  IEsSearchRequest,
  IEsSearchResponse,
  ISearchGeneric
} from '../../../../../src/plugins/data/public';
import {CoreStart} from "kibana/public";

const callSearchPromise = ({fn, opts}: { fn: ISearchGeneric, opts: IEsSearchRequest }): Promise<IEsSearchResponse> => {
  return fn(opts).toPromise()
}

function* fetchAllRtops({payload: {data, searchOpts}}: { payload: { data: DataPublicPluginStart, searchOpts: IEsSearchRequest } }) {
  try {
    const response = yield call(
      callSearchPromise, {fn: data.search.search, opts: searchOpts}
    )
    yield put({type: ActionType.RTOPS_FETCH_ALL_REQUEST_SUCCESS, payload: response.rawResponse});
  } catch (e) {
    console.error(e);
    yield put({type: ActionType.RTOPS_FETCH_ALL_REQUEST_FAILURE, payload: e});
  }
}

function* createIoc({payload: {http, payload}}: { payload: { http: CoreStart["http"], payload: CreateIOCType } }) {
  try {
    const response = yield call(
      http.post, {path: '/api/redelk/ioc', body: JSON.stringify(payload)}
    )
    yield put({type: ActionType.RTOPS_CREATE_IOC_REQUEST_SUCCESS, payload: response.rawResponse});
  } catch (e) {
    console.error(e);
    yield put({type: ActionType.RTOPS_CREATE_IOC_REQUEST_FAILURE, payload: e});
  }
}

function* onSetRtopsWatcher() {
  yield takeLatest(ActionType.RTOPS_FETCH_ALL_REQUEST as any, fetchAllRtops);
}

function* onCreateIOCWatcher() {
  yield takeLatest(ActionType.RTOPS_CREATE_IOC_REQUEST as any, createIoc);
}

export default [
  fork(onSetRtopsWatcher),
  fork(onCreateIOCWatcher)
];
