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

import React, {useCallback, useEffect, useRef, useState} from 'react';
//import {BrowserRouter as Router} from 'react-router-dom';
import {Router} from 'react-router-dom';

import {CoreStart} from 'kibana/public';
import {NavigationPublicPluginStart, TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {IOCPage} from "./iocPage";
import {SummaryPage} from "./summaryPage";
import {EuiBreadcrumb, EuiTab, EuiTabs} from '@elastic/eui';
import {setNavHeader} from "../navHeaderHelper";
import {useDispatch} from 'react-redux';
import {PLUGIN_ID, PLUGIN_NAME} from "../../common";
import {
  connectToQueryState,
  DataPublicPluginStart,
  esFilters,
  esQuery,
  Filter,
  getTime,
  IEsSearchRequest,
  IIndexPattern,
  Query,
  QueryState,
  syncQueryStateWithUrl,
  TimeRange
} from '../../../../src/plugins/data/public';
import {
  BaseState,
  BaseStateContainer,
  createStateContainer,
  createStateContainerReactHelpers,
  IKbnUrlStateStorage,
  ReduxLikeStateContainer,
  syncState
} from '../../../../src/plugins/kibana_utils/public';
import {History} from 'history';
import IOCSlice from "../features/ioc/iocSlice";

interface RedelkAppDeps {
  basename: string;
  core: CoreStart;
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
  history: History;
  kbnUrlStateStorage: IKbnUrlStateStorage;
}

interface Tabs {
  id: string;
  name: string;
  disabled: boolean;
}

interface AppState {
  name: string;
  filters: Filter[];
  query?: Query;
  time?: TimeRange;
}

const defaultAppState: AppState = {
  name: '',
  filters: [],
  time: {
    from: 'now-1y',
    to: 'now'
  }
};
const {
  Provider: AppStateContainerProvider,
  useState: useAppState,
  useContainer: useAppStateContainer,
} = createStateContainerReactHelpers<ReduxLikeStateContainer<AppState>>();


const useIndexPattern = (data: DataPublicPluginStart) => {
  const [indexPattern, setIndexPattern] = useState<IIndexPattern>();
  useEffect(() => {
    const fetchIndexPattern = async () => {
      const defaultIndexPattern = await data.indexPatterns.getDefault();
      if (defaultIndexPattern) {
        setIndexPattern(defaultIndexPattern);
      }
    };
    fetchIndexPattern();
  }, [data.indexPatterns]);

  return indexPattern;
}

const useCreateStateContainer = <State extends BaseState>(
  defaultState: State
): ReduxLikeStateContainer<State> => {
  const stateContainerRef = useRef<ReduxLikeStateContainer<State> | null>(null);
  if (!stateContainerRef.current) {
    stateContainerRef.current = createStateContainer(defaultState);
  }
  return stateContainerRef.current;
}

const useGlobalStateSyncing = (
  query: DataPublicPluginStart['query'],
  kbnUrlStateStorage: IKbnUrlStateStorage
) => {
  // setup sync state utils
  useEffect(() => {
    // sync global filters, time filters, refresh interval from data.query to url '_g'
    const {stop} = syncQueryStateWithUrl(query, kbnUrlStateStorage);
    return () => {
      stop();
    };
  }, [query, kbnUrlStateStorage]);
};

const useAppStateSyncing = <AppState extends QueryState>(
  appStateContainer: BaseStateContainer<AppState>,
  query: DataPublicPluginStart['query'],
  kbnUrlStateStorage: IKbnUrlStateStorage
) => {
  // setup sync state utils
  useEffect(() => {
    // sync app filters with app state container from data.query to state container
    const stopSyncingQueryAppStateWithStateContainer = connectToQueryState(
      query,
      appStateContainer,
      {filters: esFilters.FilterStateStore.APP_STATE, time: true}
    );

    // sets up syncing app state container with url
    const {start: startSyncingAppStateWithUrl, stop: stopSyncingAppStateWithUrl} = syncState({
      storageKey: '_a',
      stateStorage: kbnUrlStateStorage,
      stateContainer: {
        ...appStateContainer,
        // stateSync utils requires explicit handling of default state ("null")
        set: (state) => state && appStateContainer.set(state),
      },
    });

    // merge initial state from app state container and current state in url
    const initialAppState: AppState = {
      ...appStateContainer.get(),
      ...kbnUrlStateStorage.get<AppState>('_a'),
    };
    // trigger state update. actually needed in case some data was in url
    appStateContainer.set(initialAppState);

    // set current url to whatever is in app state container
    kbnUrlStateStorage.set<AppState>('_a', initialAppState);

    // finally start syncing state containers with url
    startSyncingAppStateWithUrl();

    return () => {
      stopSyncingQueryAppStateWithStateContainer();
      stopSyncingAppStateWithUrl();
    };
  }, [query, kbnUrlStateStorage, appStateContainer]);
};

const tabs: Tabs[] = [
  {
    id: 'summary',
    name: 'Summary',
    disabled: false,
  },
  {
    id: 'ioc',
    name: 'IOC',
    disabled: false,
  }
];
const DEFAULT_TAB = 'summary';

const RedelkAppInternal = ({basename, navigation, data, core, history, kbnUrlStateStorage}: RedelkAppDeps) => {
  const {notifications, http} = core;
  const appStateContainer = useAppStateContainer();
  const appState = useAppState();

  const [selectedTabId, setSelectedTabId] = useState<string>(DEFAULT_TAB);
  const [brdcrmbs, setBrdcrmbs] = useState<EuiBreadcrumb[]>([{text: tabs.find(t => t.id === DEFAULT_TAB)!.name}]);
  const [isAddIOCFlyoutVisible, setIsAddIOCFlyoutVisible] = useState(false);
  const [showTopNav, setShowTopNav] = useState<boolean>(false);

  useGlobalStateSyncing(data.query, kbnUrlStateStorage);
  useAppStateSyncing(appStateContainer, data.query, kbnUrlStateStorage);

  let breadcrumbs: EuiBreadcrumb[] = [];
  breadcrumbs.push({
    href: core.application.getUrlForApp(PLUGIN_ID),
    onClick: (e) => {
      core.application.navigateToApp(PLUGIN_ID, {path: '/'});
      e.preventDefault();
    },
    text: PLUGIN_NAME
  });
  breadcrumbs = breadcrumbs.concat(brdcrmbs);
  useEffect(() => {
    setNavHeader(core, breadcrumbs);
  }, [breadcrumbs])

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
    setBrdcrmbs([{text: tabs.find(t => t.id === id)!.name}]);
  };
  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <EuiTab
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
        disabled={tab.disabled}
        key={index}>
        {tab.name}
      </EuiTab>
    ));
  };
  let displayTab = (<></>);

  const onQuerySubmit = useCallback(
    ({query}) => {
      appStateContainer.set({...appState, query});
    },
    [appStateContainer, appState]
  );
  const dispatch = useDispatch();
  useEffect(() => {
    let tmpFilters = [...appState.filters];
    if (appState.time !== undefined) {
      const trFilter = getTime(indexPattern, appState.time);
      if (trFilter !== undefined) {
        tmpFilters.push(trFilter);
      }
    }
    const iocFilter: Filter = {
      meta: {
        alias: "ioc",
        disabled: false,
        index: "rtops",
        negate: false
      },
      query: {
        match_phrase: {
          "event.type": "ioc"
        }
      }
    }
    if (selectedTabId === 'ioc') {
      tmpFilters.push(iocFilter);
    }
    const esQueryFilters = esQuery.buildQueryFromFilters(tmpFilters, indexPattern);
    let searchOpts: IEsSearchRequest = {
      params: {
        index: 'rtops-*'
      }
    };
    if (appState.query !== undefined && searchOpts.params !== undefined && appState.query.query !== undefined && appState.query.query !== "") {
      searchOpts.params.q = appState.query.query.toString();
    }
    if (appState.filters !== undefined && searchOpts.params !== undefined) {

      searchOpts.params.body = {
        query: {
          bool: esQueryFilters
        }
      }

      if (selectedTabId === 'summary') {
        searchOpts.params.body.aggs = {
          perEventType: {
            terms: {
              field: "event.type",
              order: {
                "_count": "desc"
              }
            }
          },
          perHostName: {
            terms: {
              field: "host.name",
              order: {
                "_count": "desc"
              }
            }
          },
          perUserName: {
            terms: {
              field: "user.name",
              order: {
                "_count": "desc"
              }
            }
          }
        }
      }

    }


    data.search.search(searchOpts).forEach((res) => {
      dispatch(IOCSlice.actions.setIOC(res.rawResponse));
    });

  }, [appState]);

  const indexPattern = useIndexPattern(data);
  if (!indexPattern)
    return <div>No index pattern found. Please create an index patter before loading...</div>;
  let navConfig: TopNavMenuData[] = [];
  switch (selectedTabId) {
    case "ioc":
      displayTab = (
        <IOCPage basename={basename} notifications={notifications} http={http} navigation={navigation} data={data}
                 showAddIOCFlyout={isAddIOCFlyoutVisible} setIOCFlyoutVisible={setIsAddIOCFlyoutVisible}
                 showTopNav={setShowTopNav}/>);
      navConfig.push({
        id: "add-ioc",
        label: "Add IOC",
        run: () => {
          setIsAddIOCFlyoutVisible(true)
        }
      })
      break;
    case "summary":
    default:
      displayTab = (
        <SummaryPage basename={basename} notifications={notifications} http={http} navigation={navigation}
                     showTopNav={setShowTopNav}/>);
      break;
  }

  const topNav = showTopNav ? (
    <navigation.ui.TopNavMenu
      appName={PLUGIN_ID}
      showSearchBar={true}
      indexPatterns={[indexPattern]}
      useDefaultBehaviors={true}
      onQuerySubmit={onQuerySubmit}
      query={appState.query}
      showSaveQuery={true}
      config={navConfig}
    />
  ) : '';

  return (
    <Router history={history}>
      <>
        <EuiTabs
          size="s"
          expand
        >
          {renderTabs()}
        </EuiTabs>
        {topNav}
        {displayTab}
      </>

    </Router>
  )
};

export const RedelkApp = (props: RedelkAppDeps) => {
  const appStateContainer = useCreateStateContainer(defaultAppState);

  return (
    <AppStateContainerProvider value={appStateContainer}>
      <RedelkAppInternal {...props} />
    </AppStateContainerProvider>
  );
};
