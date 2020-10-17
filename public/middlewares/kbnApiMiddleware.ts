import {Dispatch, Middleware} from 'redux';
import {KbnApiMiddlewareDeps, RedELKState} from '../types';
import {ThunkDispatch} from 'redux-thunk';
import {ActionType} from "../redux/types";

interface MiddlewareArgs {
  dispatch: ThunkDispatch<any, any, any>;
  getState: () => RedELKState;
}

const kbnApi = (
  {notifications, http}: KbnApiMiddlewareDeps
) => {
  const kbnApiMiddleware: Middleware = (
    {dispatch, getState}: MiddlewareArgs
  ) => (
    next: Dispatch
  ) => action => {
    //console.log('Called kbnApiMiddleware');
    //console.log(http);
    switch (action.type) {
      case ActionType.RTOPS_CREATE_IOC_REQUEST_SUCCESS:
        // Wait 3 seconds for the data to be ingested before fetching all IOCs again.
        //setTimeout(() => dispatch(fetchAllIOC({http})), 3000);
        //dispatch(fetchAllIOC({http}));
        notifications.toasts.addSuccess('IOC successfully created. Please wait for Elasticsearch to ingest the data then hit "Refresh".');
        return next(action);
        break;
      default:
        break;
      //console.log(action.type);
    }
    return next(action);
  }
  return kbnApiMiddleware;
}

export default kbnApi;
