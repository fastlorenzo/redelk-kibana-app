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

import { CoreStart } from 'kibana/public';
import createReducer from '../createReducer';
import { Action, ActionType, CreateIOCType, RtopsState } from '../types';
import { EsAnswer, EsAnswerRtops, KbnCallStatus } from '../../types';

const initialState: RtopsState = {
  status: KbnCallStatus.idle,
  error: null,
  rtops: undefined,
  showAddIOCForm: false,
  lastRefresh: undefined,
};

export const rtopsReducer = createReducer<RtopsState>(initialState, {
  [ActionType.RTOPS_FETCH_ALL_REQUEST](state: RtopsState, action: Action<EsAnswer<EsAnswerRtops>>) {
    return {
      ...state,
      status: KbnCallStatus.pending,
    };
  },
  [ActionType.RTOPS_FETCH_ALL_REQUEST_SUCCESS](
    state: RtopsState,
    action: Action<EsAnswer<EsAnswerRtops>>
  ) {
    return {
      ...state,
      rtops: action.payload,
      status: KbnCallStatus.success,
      error: null,
      lastRefresh: new Date(),
    };
  },
  [ActionType.RTOPS_FETCH_ALL_REQUEST_FAILURE](state: RtopsState, action: Action<any>) {
    return {
      ...state,
      status: KbnCallStatus.failure,
      error: action.payload,
    };
  },

  [ActionType.RTOPS_CREATE_IOC_REQUEST](
    state: RtopsState,
    action: Action<{ http: CoreStart['http']; payload: CreateIOCType }>
  ) {
    return {
      ...state,
    };
  },
  [ActionType.RTOPS_CREATE_IOC_REQUEST_SUCCESS](
    state: RtopsState,
    action: Action<EsAnswer<EsAnswerRtops>>
  ) {
    return {
      ...state,
      status: KbnCallStatus.success,
      error: null,
    };
  },
  [ActionType.RTOPS_CREATE_IOC_REQUEST_FAILURE](state: RtopsState, action: Action<any>) {
    return {
      ...state,
      status: KbnCallStatus.failure,
      error: action.payload,
    };
  },

  [ActionType.RTOPS_SHOW_ADD_IOC_FORM](state: RtopsState, action: Action<boolean>) {
    return {
      ...state,
      showAddIOCForm: action.payload,
    };
  },
});

export default rtopsReducer;
