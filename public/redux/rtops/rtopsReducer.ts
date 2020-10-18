import createReducer from '../createReducer';
import {Action, ActionType, CreateIOCType, RtopsState} from "../types";
import {EsAnswer, EsAnswerRtops, KbnCallStatus} from "../../types";
import {CoreStart} from "kibana/public";

const initialState: RtopsState = {
  status: KbnCallStatus.idle,
  error: null,
  rtops: undefined,
  showAddIOCForm: false,
  lastRefresh: undefined
};

export const rtopsReducer = createReducer<RtopsState>(initialState, {

  [ActionType.RTOPS_FETCH_ALL_REQUEST](state: RtopsState, action: Action<EsAnswer<EsAnswerRtops>>) {
    return {
      ...state,
      status: KbnCallStatus.pending,
    };
  },
  [ActionType.RTOPS_FETCH_ALL_REQUEST_SUCCESS](state: RtopsState, action: Action<EsAnswer<EsAnswerRtops>>) {
    return {
      ...state,
      rtops: action.payload,
      status: KbnCallStatus.success,
      error: null,
      lastRefresh: new Date()
    };
  },
  [ActionType.RTOPS_FETCH_ALL_REQUEST_FAILURE](state: RtopsState, action: Action<any>) {
    return {
      ...state,
      status: KbnCallStatus.failure,
      error: action.payload
    };
  },

  [ActionType.RTOPS_CREATE_IOC_REQUEST](state: RtopsState, action: Action<{ http: CoreStart['http'], payload: CreateIOCType }>) {
    return {
      ...state,
    };
  },
  [ActionType.RTOPS_CREATE_IOC_REQUEST_SUCCESS](state: RtopsState, action: Action<EsAnswer<EsAnswerRtops>>) {
    return {
      ...state,
      status: KbnCallStatus.success,
      error: null
    };
  },
  [ActionType.RTOPS_CREATE_IOC_REQUEST_FAILURE](state: RtopsState, action: Action<any>) {
    return {
      ...state,
      status: KbnCallStatus.failure,
      error: action.payload
    };
  },

  [ActionType.RTOPS_SHOW_ADD_IOC_FORM](state: RtopsState, action: Action<boolean>) {
    return {
      ...state,
      showAddIOCForm: action.payload
    };
  },
});

export default rtopsReducer;
