/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import {FormattedMessage, I18nProvider} from '@kbn/i18n/react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {fetchAllIOC} from '../features/ioc/iocSlice';
import {AddIOCForm} from '../features/ioc/addIocForm';
import {IOCTable} from '../features/ioc/iocTable';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle
} from '@elastic/eui';

import {CoreStart} from 'kibana/public';
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';

import {PLUGIN_ID, PLUGIN_NAME} from '../../common';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const RedelkApp = ({basename, notifications, http, navigation}: RedelkAppDeps) => {
  // Use React hooks to manage state.
  const dispatch = useDispatch();

  const onClickHandlerIOC = () => {
    dispatch(fetchAllIOC({http}));
  };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={false}
            useDefaultBehaviors={false}
          />
          <EuiPage>
            <EuiPageBody>
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="redelk.helloWorldText"
                      defaultMessage="{name}"
                      values={{name: PLUGIN_NAME}}
                    />
                  </h1>
                </EuiTitle>
                <EuiButton type="primary" size="s" onClick={onClickHandlerIOC}>
                  <FormattedMessage id="redelk.buttonText2" defaultMessage="Refresh IOC list"/>
                </EuiButton>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="redelk.congratulationsTitle"
                        defaultMessage="IOC manual ingestion"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiText>
                    <p>
                      <FormattedMessage
                        id="redelk.content"
                        defaultMessage="In this page you can manually ingest IOC in RedELK."
                      />
                    </p>
                  </EuiText>
                  <EuiSpacer/>
                  <EuiPanel>
                    <AddIOCForm http={http}/>
                  </EuiPanel>
                  <EuiSpacer/>
                  <IOCTable http={http}/>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
