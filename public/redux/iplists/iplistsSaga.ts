/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { CoreStart } from 'kibana/public';
import { ActionType, CreateIPType, DeleteIPType } from '../types';
import {
  DataPublicPluginStart,
  IEsSearchRequest,
  IEsSearchResponse,
  ISearchGeneric,
} from '../../../../../src/plugins/data/public';

const callSearchPromise = ({
  fn,
  opts,
}: {
  fn: ISearchGeneric;
  opts: IEsSearchRequest;
}): Promise<IEsSearchResponse> => {
  return fn(opts).toPromise();
};

function* fetchAllIPLists({
  payload: { data, searchOpts },
}: {
  payload: { data: DataPublicPluginStart; searchOpts: IEsSearchRequest };
}) {
  try {
    const response = yield call(callSearchPromise, { fn: data.search.search, opts: searchOpts });
    yield put({
      type: ActionType.IPLISTS_FETCH_ALL_REQUEST_SUCCESS,
      payload: response.rawResponse,
    });
  } catch (e) {
    console.error(e);
    yield put({ type: ActionType.IPLISTS_FETCH_ALL_REQUEST_FAILURE, payload: e });
  }
}

function* createIP({
  payload: { http, payload },
}: {
  payload: { http: CoreStart['http']; payload: CreateIPType };
}) {
  try {
    const response = yield call(http.post, {
      path: '/api/redelk/iplists',
      body: JSON.stringify(payload),
    });
    yield put({
      type: ActionType.IPLISTS_CREATE_IP_REQUEST_SUCCESS,
      payload: response.rawResponse,
    });
  } catch (e) {
    console.error(e);
    yield put({ type: ActionType.IPLISTS_CREATE_IP_REQUEST_FAILURE, payload: e });
  }
}

function* deleteIPs({
  payload: { http, payload },
}: {
  payload: { http: CoreStart['http']; payload: DeleteIPType[] };
}) {
  try {
    const response = yield call(http.delete, {
      path: '/api/redelk/iplists',
      body: JSON.stringify(payload),
    });
    yield put({
      type: ActionType.IPLISTS_DELETE_IPS_REQUEST_SUCCESS,
      payload: response.rawResponse,
    });
  } catch (e) {
    console.error(e);
    yield put({ type: ActionType.IPLISTS_DELETE_IPS_REQUEST_FAILURE, payload: e });
  }
}

function* onSetIPListsWatcher() {
  yield takeLatest(ActionType.IPLISTS_FETCH_ALL_REQUEST as any, fetchAllIPLists);
}

function* onCreateIPWatcher() {
  yield takeLatest(ActionType.IPLISTS_CREATE_IP_REQUEST as any, createIP);
}

function* onDeleteIPsWatcher() {
  yield takeLatest(ActionType.IPLISTS_DELETE_IPS_REQUEST as any, deleteIPs);
}

export default [fork(onSetIPListsWatcher), fork(onCreateIPWatcher), fork(onDeleteIPsWatcher)];
