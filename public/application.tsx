/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

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
