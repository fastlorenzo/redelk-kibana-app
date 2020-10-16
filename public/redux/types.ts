import {Filter} from '../../../../src/plugins/data/public';
import {C2Data, EsAnswerRtops, FileData, HostData, KbnCallStatus, RedelkInitStatus, UserData} from '../types';

export enum ActionType {
  // config
  CONFIG_SHOW_TOP_NAV = "config/CONFIG_SHOW_TOP_NAV",
  CONFIG_SET_CURRENT_ROUTE = "config/CONFIG_SET_CURRENT_ROUTE",
  CONFIG_SET_IS_INITIALIZED = "config/CONFIG_SET_IS_INITIALIZED",

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
}


/**
 * Rtops types
 */
export interface RtopsState {
  status: KbnCallStatus;
  error: string | undefined | null;
  rtops: EsAnswerRtops | undefined;
  showAddIOCForm: boolean;
  hiddenFilters?: Filter[]
}

export interface CreateIOCTypeIOC {
  type: string;
}

export interface CreateIOCType {
  '@timestamp': string;
  ioc: CreateIOCTypeIOC;
  file: FileData;
  c2: C2Data;
  host: HostData;
  user: UserData;
}
