import {ActionType, AppState} from "../types";
import {CoreStart} from "kibana/public";
import {TopNavMenuData} from '../../../../../src/plugins/navigation/public';


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

export const setAppState = (payload: AppState) => {
  return {
    type: ActionType.CONFIG_SET_APPSTATE,
    payload
  }
};

export const setTopNavMenu = (payload: TopNavMenuData[]) => {
  return {
    type: ActionType.CONFIG_SET_TOPNAVMENU,
    payload
  }
};
