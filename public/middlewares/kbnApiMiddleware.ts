import {Dispatch, Middleware, MiddlewareAPI} from 'redux';
import {KbnApiMiddlewareDeps} from '../types';

const kbnApi = (
  {notifications, http}: KbnApiMiddlewareDeps
) => {
  const kbnApiMiddleware: Middleware = (
    {dispatch, getState}: MiddlewareAPI
  ) => (
    next: Dispatch
  ) => action => {
    //console.log('Called kbnApiMiddleware');
    //console.log(http);
    //notifications.toasts.addSuccess('test');
    next(action);
  }
  return kbnApiMiddleware;
}

export default kbnApi;
