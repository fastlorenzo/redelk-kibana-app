/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
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

import {TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {Filter, Query, TimeRange} from '../../../../src/plugins/data/public';
import {
  C2Data,
  EsAnswerIPLists,
  EsAnswerRtops,
  FileData,
  HostData,
  KbnCallStatus,
  RedelkInitStatus,
  UserData
} from '../types';

export enum ActionType {
  // config
  CONFIG_SHOW_TOP_NAV = "config/CONFIG_SHOW_TOP_NAV",
  CONFIG_SET_CURRENT_ROUTE = "config/CONFIG_SET_CURRENT_ROUTE",
  CONFIG_SET_IS_INITIALIZED = "config/CONFIG_SET_IS_INITIALIZED",
  CONFIG_SET_APPSTATE = "config/CONFIG_SET_APPSTATE",
  CONFIG_SET_TOPNAVMENU = "config/CONFIG_SET_TOPNAVMENU",

  CONFIG_REDELK_INIT_CHECK = "config/CONFIG_REDELK_INIT_CHECK",
  CONFIG_REDELK_INIT_CHECK_SUCCESS = "config/CONFIG_REDELK_INIT_CHECK_SUCCESS",
  CONFIG_REDELK_INIT_CHECK_FAILURE = "config/CONFIG_REDELK_INIT_CHECK_FAILURE",

  // rtops
  RTOPS_FETCH_ALL_REQUEST = "rtops/RTOPS_FETCH_ALL_REQUEST",
  RTOPS_FETCH_ALL_REQUEST_SUCCESS = "rtops/RTOPS_FETCH_ALL_REQUEST_SUCCESS",
  RTOPS_FETCH_ALL_REQUEST_FAILURE = "rtops/RTOPS_FETCH_ALL_REQUEST_FAILURE",

  RTOPS_CREATE_IOC_REQUEST = "rtops/RTOPS_CREATE_IOC_REQUEST",
  RTOPS_CREATE_IOC_REQUEST_SUCCESS = "rtops/RTOPS_CREATE_IOC_REQUEST_SUCCESS",
  RTOPS_CREATE_IOC_REQUEST_FAILURE = "rtops/RTOPS_CREATE_IOC_REQUEST_FAILURE",

  RTOPS_SET_IOC = "rtops/RTOPS_SET_IOC",
  RTOPS_SHOW_ADD_IOC_FORM = "rtops/RTOPS_SHOW_ADD_IOC_FORM",
  RTOPS_SET_STATUS = "rtops/RTOPS_SET_STATUS",

  // iplists
  IPLISTS_FETCH_ALL_REQUEST = "iplists/IPLISTS_FETCH_ALL_REQUEST",
  IPLISTS_FETCH_ALL_REQUEST_SUCCESS = "iplists/IPLISTS_FETCH_ALL_REQUEST_SUCCESS",
  IPLISTS_FETCH_ALL_REQUEST_FAILURE = "iplists/IPLISTS_FETCH_ALL_REQUEST_FAILURE",

  IPLISTS_CREATE_IP_REQUEST = "iplists/IPLISTS_CREATE_IP_REQUEST",
  IPLISTS_CREATE_IP_REQUEST_SUCCESS = "iplists/IPLISTS_CREATE_IP_REQUEST_SUCCESS",
  IPLISTS_CREATE_IP_REQUEST_FAILURE = "iplists/IPLISTS_CREATE_IP_REQUEST_FAILURE",

  IPLISTS_DELETE_IPS_REQUEST = "iplists/IPLISTS_DELETE_IPS_REQUEST",
  IPLISTS_DELETE_IPS_REQUEST_SUCCESS = "iplists/IPLISTS_DELETE_IPS_REQUEST_SUCCESS",
  IPLISTS_DELETE_IPS_REQUEST_FAILURE = "iplists/IPLISTS_DELETE_IPS_REQUEST_FAILURE",

  IPLISTS_SHOW_ADD_IP_FORM = "iplists/IPLISTS_SHOW_ADD_IP_FORM",
  IPLISTS_SHOW_MANAGE_IPLISTS = "iplists/IPLISTS_SHOW_MANAGE_IPLISTS",
  IPLISTS_SET_STATUS = "iplists/IPLISTS_SET_STATUS",
}

export interface Action<T> {
  type: ActionType;
  payload: T;
}


/**
 * Config types
 */
export interface ConfigState {
  initStatus: RedelkInitStatus;
  showTopNav: boolean;
  currentRoute: string;
  appState: AppState;
  topNavMenu: TopNavMenuData[];
}

export interface AppState {
  name: string;
  filters: Filter[];
  query?: Query;
  time?: TimeRange;
}

export const defaultAppState: AppState = {
  name: '',
  filters: [],
  time: {
    from: 'now-1y',
    to: 'now'
  }
};

/**
 * Rtops types
 */
export interface RtopsState {
  status: KbnCallStatus;
  error: string | undefined | null;
  rtops: EsAnswerRtops | undefined;
  showAddIOCForm: boolean;
  hiddenFilters?: Filter[];
  lastRefresh?: Date;
}

export interface CreateIOCTypeIOC {
  type: string;
  domain: string;
}

export interface CreateIOCType {
  '@timestamp': string;
  ioc: CreateIOCTypeIOC;
  file: FileData;
  c2: C2Data;
  host: HostData;
  user: UserData;
}

/**
 * IPLists types
 */
export interface IPListsState {
  status: KbnCallStatus;
  error: string | undefined | null;
  iplists: EsAnswerIPLists | undefined;
  showAddIPForm: boolean;
  showManageIPLists: boolean;
  hiddenFilters?: Filter[];
  lastRefresh?: Date;
}

export interface CreateIPTypeIP {
  ip: string;
  name: string;
  source: string;
}

export interface CreateIPType {
  '@timestamp': string;
  iplist: CreateIPTypeIP;
}

export interface DeleteIPType {
  id: string;
  index: string;
}
