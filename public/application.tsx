import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';

import {AppMountParameters, CoreStart} from 'kibana/public';
import {RedelkPluginStartDependencies} from './types';
import {RedelkApp} from './components/app';
import rootReducer from './redux/rootReducer';

import kbnApiMiddleware from './middlewares/kbnApiMiddleware';
import {KibanaContextProvider} from '../../../src/plugins/kibana_react/public';
import {createKbnUrlStateStorage} from '../../../src/plugins/kibana_utils/public';
import rootSaga from "./redux/rootSaga";

export const renderApp = (
  core: CoreStart,
  appDeps: RedelkPluginStartDependencies,
  {appBasePath, element, history}: AppMountParameters
) => {
  const {notifications, http} = core;
  const {navigation, data} = appDeps;

  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware, kbnApiMiddleware({notifications, http})],
    devTools: true
  });

  sagaMiddleware.run(rootSaga);
  const kbnUrlStateStorage = createKbnUrlStateStorage({useHash: false, history});
  console.log(core, appDeps);
  ReactDOM.render(
    <Provider store={store}>
      <KibanaContextProvider
        services={{
          ...core,
          ...appDeps
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
