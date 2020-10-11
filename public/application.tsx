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
import {KibanaContextProvider} from '../../../src/plugins/kibana_react/public';
import {createKbnUrlStateStorage} from '../../../src/plugins/kibana_utils/public';

export const renderApp = (
  core: CoreStart,
  {navigation, data}: AppPluginStartDependencies,
  {appBasePath, element, history}: AppMountParameters
) => {
  const {notifications, http} = core;
  const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, kbnApiMiddleware({notifications, http})]
  });
  const kbnUrlStateStorage = createKbnUrlStateStorage({useHash: false, history});
//    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ReactDOM.render(
    <Provider store={store}>
      <KibanaContextProvider
        services={{
          uiSettings: core.uiSettings,
          docLinks: core.docLinks,
          data: data,
          navigation: navigation
        }}
      >
        <RedelkApp
          basename={appBasePath}
          navigation={navigation}
          core={core}
          data={data}
          history={history}
          kbnUrlStateStorage={kbnUrlStateStorage}
        />
      </KibanaContextProvider>
    </Provider>
    ,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
