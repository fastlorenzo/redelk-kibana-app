import {ActionType} from "../types";
import {CoreStart} from "kibana/public";


export const setShowTopNav = (payload: boolean) => {
  return {
    type: ActionType.CONFIG_SHOW_TOP_NAV,
    payload
  }
};

export const setCurrentRoute = (payload: string) => {
  return {
    type: ActionType.CONFIG_SET_CURRENT_ROUTE,
    payload
  }
};

export const checkInit = (http: CoreStart["http"]) => {
  return {
    type: ActionType.CONFIG_REDELK_INIT_CHECK,
    http: http
  }
};
