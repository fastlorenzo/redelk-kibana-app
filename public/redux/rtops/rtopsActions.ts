import {ActionType, CreateIOCType} from "../types";
import {CoreStart} from 'kibana/public';
import {KbnCallStatus} from "../../types";
import {DataPublicPluginStart, IEsSearchRequest} from '../../../../../src/plugins/data/public';

interface ActionArgs<T> {
  http: CoreStart['http'];
  payload?: T;
}

export const fetchAllRtops = (payload: { data: DataPublicPluginStart, searchOpts: IEsSearchRequest }) => {
  return {
    type: ActionType.RTOPS_FETCH_ALL_REQUEST,
    payload
  }
};

export const createIOC = (payload: ActionArgs<CreateIOCType>) => {
  return {
    type: ActionType.RTOPS_CREATE_IOC_REQUEST,
    payload
  }
};

export const setStatus = (payload: KbnCallStatus) => {
  return {
    type: ActionType.RTOPS_SET_STATUS,
    payload
  }
};

export const setShowAddIOCForm = (payload: boolean) => {
  return {
    type: ActionType.RTOPS_SHOW_ADD_IOC_FORM,
    payload
  }
}
