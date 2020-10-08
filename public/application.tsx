import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit";

import {AppMountParameters, CoreStart} from 'kibana/public';
import {AppPluginStartDependencies} from './types';
import {RedelkApp} from './components/app';
import rootReducer from './reducers';

import kbnApiMiddleware from './middlewares/kbnApiMiddleware';

export const renderApp = (
  {notifications, http}: CoreStart,
  {navigation}: AppPluginStartDependencies,
  {appBasePath, element}: AppMountParameters
) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, kbnApiMiddleware({notifications, http})]
  });
//    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ReactDOM.render(
    <Provider store={store}>
      <RedelkApp
        basename={appBasePath}
        notifications={notifications}
        http={http}
        navigation={navigation}
      />
    </Provider>
    ,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
