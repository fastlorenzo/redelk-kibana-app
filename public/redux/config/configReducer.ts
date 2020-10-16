import createReducer from '../createReducer';
import {Action, ActionType, ConfigState, RtopsState} from "../types";
import {RedelkInitStatus} from "../../types";

const initialState: ConfigState = {
  showTopNav: false,
  currentRoute: "",
  initStatus: RedelkInitStatus.idle
};

export const configReducer = createReducer<ConfigState>(initialState, {

  [ActionType.CONFIG_REDELK_INIT_CHECK](state: RtopsState, action: Action<string>) {
    return {
      ...state,
      initStatus: RedelkInitStatus.pending,
    };
  },
  [ActionType.CONFIG_REDELK_INIT_CHECK_SUCCESS](state: RtopsState, action: Action<string>) {
    return {
      ...state,
      status: RedelkInitStatus.success,
      initStatus: null
    };
  },
  [ActionType.CONFIG_REDELK_INIT_CHECK_FAILURE](state: RtopsState, action: Action<string>) {
    return {
      ...state,
      initStatus: RedelkInitStatus.failure,
    };
  },

  [ActionType.CONFIG_SHOW_TOP_NAV](state: ConfigState, action: Action<boolean>) {
    return {
      ...state,
      showTopNav: action.payload
    };
  },

  [ActionType.CONFIG_SET_CURRENT_ROUTE](state: ConfigState, action: Action<string>) {
    return {
      ...state,
      currentRoute: action.payload
    };
  },

  [ActionType.CONFIG_SET_IS_INITIALIZED](state: ConfigState, action: Action<boolean>) {
    return {
      ...state,
      isInitialized: action.payload
    };
  },
});
