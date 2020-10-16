import React, {ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {Redirect, Route, Router} from 'react-router-dom';

import {CoreStart} from 'kibana/public';
import {NavigationPublicPluginStart, TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {IOCPage} from "./iocPage";
import {SummaryPage} from "./summaryPage";
import {
  EuiBreadcrumb,
  EuiButtonEmpty,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiLoadingSpinner,
  EuiPopover
} from '@elastic/eui';
import {setNavHeader} from "../navHeaderHelper";
import {useDispatch, useSelector} from 'react-redux';
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
import {ActionCreators} from "../redux/rootActions";
import {DEFAULT_ROUTE_ID, routes} from "../routes";
import {RedelkURLGenerator} from "../url_generator";
import {KbnCallStatus, RedelkInitStatus} from "../types";
import {getCurrentRoute, getInitStatus, getShowTopNav} from "../selectors";
import {checkInit} from "../redux/config/configActions";
import {InitPage} from './initPage';

interface RedelkAppDeps {
  basename: string;
  core: CoreStart;
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
  history: History;
  kbnUrlStateStorage: IKbnUrlStateStorage;
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
      try {
        const defaultIndexPattern = await data.indexPatterns.getDefault();
        if (defaultIndexPattern) {
          setIndexPattern(defaultIndexPattern);
        } else {
          try {
            const rtopsIndexPattern = await data.indexPatterns.get("rtops");
            if (rtopsIndexPattern) {
              setIndexPattern(rtopsIndexPattern);
            }
          } catch (e) {
            console.log("Error getting rtops index pattern:", e);
          }
        }
      } catch (e) {
        console.log('Error getting default index pattern:', e);
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

const RedelkAppInternal = ({basename, navigation, data, core, history, kbnUrlStateStorage}: RedelkAppDeps) => {
  const {notifications, http} = core;
  const appStateContainer = useAppStateContainer();
  const appState = useAppState();

  const showTopNav = useSelector(getShowTopNav);
  const currentRoute = useSelector(getCurrentRoute);
  const initStatus = useSelector(getInitStatus);

  const [topNavMenu, setTopNavMenu] = useState<TopNavMenuData[]>([]);
  const [currentPageTitle, setCurrentPageTitle] = useState<string>(routes.find(r => r.id === DEFAULT_ROUTE_ID)!.name);
  const [isPopoverOpen, setPopover] = useState(false);

  const onButtonClick = () => {
    setPopover(!isPopoverOpen);
  };
  const closePopover = () => {
    setPopover(false);
  };

  useGlobalStateSyncing(data.query, kbnUrlStateStorage);
  useAppStateSyncing(appStateContainer, data.query, kbnUrlStateStorage);
  useEffect(() => {
    if (location.pathname !== currentRoute) {
      dispatch(ActionCreators.setCurrentRoute(location.pathname));
    }
  });

  // BEGIN top drop-down menu
  const button = (
    <EuiButtonEmpty
      size="s"
      iconType="arrowDown"
      iconSide="right"
      onClick={onButtonClick}
    >
      {currentPageTitle}
    </EuiButtonEmpty>
  );

  // Listen to the appState and update menu links
  useEffect(() => {
    let items: ReactElement[];
    items = routes.map(r => {
      const generator = new RedelkURLGenerator({appBasePath: r.path, useHash: false});
      let path = generator.createUrl(appState);
      //console.log('url', path, appState, appStateContainer);
      return (
        <EuiContextMenuItem
          key={r.id}
          icon={r.icon}
          onClick={() => {
            closePopover();
            setCurrentPageTitle(r.name);
            history.push(path);
          }}
        >
          {r.name}
        </EuiContextMenuItem>
      )
    });


    const breadcrumbs: EuiBreadcrumb[] = [
      {
        href: core.application.getUrlForApp(PLUGIN_ID),
        onClick: (e) => {
          core.application.navigateToApp(PLUGIN_ID, {
            path: routes.find(r => r.id === DEFAULT_ROUTE_ID)!.path || "/",
            state: appState
          });
          e.preventDefault();
        },
        text: PLUGIN_NAME
      },
      {
        onClick: (e) => {
        },
        text: (
          <EuiPopover
            id="singlePanel"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
          >
            <EuiContextMenuPanel items={items}/>
          </EuiPopover>
        )
      }
    ];

    setNavHeader(core, breadcrumbs);
  }, [appState.time, appState.query, appState.filters, history.location, data.query]);

  const onQuerySubmit = useCallback(
    ({query, dateRange}) => {
      appStateContainer.set({...appState, query, time: dateRange});
    },
    [appStateContainer, appState]
  );

  const dispatch = useDispatch();

  // Build ES query and fetch data
  useEffect(() => {
    dispatch(ActionCreators.setStatus(KbnCallStatus.pending));
    let tmpFilters = appState.filters ? [...appState.filters] : [];
    if (appState.time !== undefined) {
      const trFilter = getTime(indexPattern, appState.time);
      if (trFilter !== undefined) {
        tmpFilters.push(trFilter);
      }
    }

    if (history.location.pathname === '/ioc') {
      setTopNavMenu([{
        id: "add-ioc",
        label: "Add IOC",
        run: () => {
          dispatch(ActionCreators.setShowAddIOCForm(true))
        }
      }])
    }
    const esQueryFilters = esQuery.buildQueryFromFilters(tmpFilters, indexPattern);
    let searchOpts: IEsSearchRequest = {
      params: {
        index: 'rtops-*',
        size: 10000,
        body: {
          aggs: {
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
            },
            perImplant: {
              terms: {
                field: "implant.id",
                order: {
                  "_count": "desc"
                }
              }
            }
          }
        }
      }
    };
    if (searchOpts.params !== undefined) {
      // If a query was entered
      if (appState.query !== undefined && appState.query.query !== undefined && appState.query.query !== "") {
        searchOpts.params.q = appState.query.query.toString();
      }
      // If the state contains a filter
      if (appState.filters !== undefined || appState.time !== undefined) {
        searchOpts.params.body.query = {
          bool: esQueryFilters
        }
      }
    }
    dispatch(ActionCreators.fetchAllRtops({data, searchOpts}));

  }, [appState.filters, appState.query, appState.time, currentRoute]);

  const indexPattern = useIndexPattern(data);

  if (initStatus === RedelkInitStatus.idle) {
    dispatch(checkInit(http));
    return (
      <InitPage
        title={(
          <h2>Loading {PLUGIN_NAME}</h2>
        )}
        content={(
          <p><EuiLoadingSpinner size="xl"/> Waiting for {PLUGIN_NAME} initialization to start.</p>
        )}
      />
    );
  }
  if (initStatus === RedelkInitStatus.pending) {
    return (
      <InitPage
        title={(
          <h2>Loading {PLUGIN_NAME}</h2>
        )}
        content={(
          <p><EuiLoadingSpinner size="xl"/> Waiting for {PLUGIN_NAME} initialization to complete.</p>
        )}
      />
    );
  }
  if (initStatus === RedelkInitStatus.failure) {
    return (
      <InitPage
        title={(
          <h2>Error loading {PLUGIN_NAME}</h2>
        )}
        content={(
          <p>ERROR: --</p>
        )}
      />
    );
  }
  if (!indexPattern) {
    return (
      <InitPage
        title={(
          <h2>Error loading {PLUGIN_NAME}</h2>
        )}
        content={(
          <p>No default index pattern found. Please set the default index pattern to "rtops-*".</p>
        )}
      />
    );
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
      config={topNavMenu}
    />
  ) : '';

  return (
    <Router history={history}>
      {topNav}

      <Route path="/" exact render={() => <Redirect to="/summary"/>}/>
      {/*<Route path="/home" exact*/}
      {/*       render={() =>*/}
      {/*         <HomePage/>*/}
      {/*       }*/}
      {/*/>*/}
      <Route path="/summary" exact
             render={() =>
               <SummaryPage
                 basename={basename}
                 notifications={notifications}
                 http={http}
                 navigation={navigation}
               />}
      />
      <Route path="/ioc"
             render={() =>
               <IOCPage
                 basename={basename}
                 notifications={notifications}
                 http={http}
                 navigation={navigation}
                 data={data}
               />}
      />

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