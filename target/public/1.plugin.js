(window["redelk_bundle_jsonpfunction"] = window["redelk_bundle_jsonpfunction"] || []).push([[1],{

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! exports provided: renderApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderApp", function() { return renderApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @reduxjs/toolkit */ "./node_modules/@reduxjs/toolkit/dist/index.js");
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redux-saga */ "./node_modules/redux-saga/dist/redux-saga-core-npm-proxy.cjs.js");
/* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(redux_saga__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");
/* harmony import */ var _redux_rootReducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./redux/rootReducer */ "./public/redux/rootReducer.ts");
/* harmony import */ var _middlewares_kbnApiMiddleware__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./middlewares/kbnApiMiddleware */ "./public/middlewares/kbnApiMiddleware.ts");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../src/plugins/kibana_react/public */ "plugin/kibanaReact/public");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../src/plugins/kibana_utils/public */ "plugin/kibanaUtils/public");
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _redux_rootSaga__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./redux/rootSaga */ "./public/redux/rootSaga.ts");











const renderApp = (core, appDeps, {
  appBasePath,
  element,
  history
}) => {
  const {
    notifications,
    http
  } = core;
  const {
    navigation,
    data
  } = appDeps;
  const sagaMiddleware = redux_saga__WEBPACK_IMPORTED_MODULE_4___default()();
  const store = Object(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__["configureStore"])({
    reducer: _redux_rootReducer__WEBPACK_IMPORTED_MODULE_6__["default"],
    middleware: [sagaMiddleware, Object(_middlewares_kbnApiMiddleware__WEBPACK_IMPORTED_MODULE_7__["default"])({
      notifications,
      http
    })],
    devTools: true
  });
  sagaMiddleware.run(_redux_rootSaga__WEBPACK_IMPORTED_MODULE_10__["default"]);
  const kbnUrlStateStorage = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__["createKbnUrlStateStorage"])({
    useHash: false,
    history
  });
  react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
    store: store
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__["KibanaContextProvider"], {
    services: { ...core,
      ...appDeps
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_app__WEBPACK_IMPORTED_MODULE_5__["RedelkApp"], {
    basename: appBasePath,
    navigation: navigation,
    core: core,
    data: data,
    history: history,
    kbnUrlStateStorage: kbnUrlStateStorage
  }))), element);
  return () => react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.unmountComponentAtNode(element);
};

/***/ }),

/***/ "./public/components/alarmsPage.tsx":
/*!******************************************!*\
  !*** ./public/components/alarmsPage.tsx ***!
  \******************************************/
/*! exports provided: AlarmsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlarmsPage", function() { return AlarmsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const AlarmsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "53b69200-d4e3-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! exports provided: RedelkApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedelkApp", function() { return RedelkApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _iocPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iocPage */ "./public/components/iocPage.tsx");
/* harmony import */ var _summaryPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./summaryPage */ "./public/components/summaryPage.tsx");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common */ "./common/index.ts");
/* harmony import */ var _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../src/plugins/data/public */ "plugin/data/public");
/* harmony import */ var _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../src/plugins/kibana_utils/public */ "plugin/kibanaUtils/public");
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _redux_rootActions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../redux/rootActions */ "./public/redux/rootActions.ts");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../routes */ "./public/routes.tsx");
/* harmony import */ var _helpers_url_generator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../helpers/url_generator */ "./public/helpers/url_generator.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../types */ "./public/types.ts");
/* harmony import */ var _redux_selectors__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../redux/selectors */ "./public/redux/selectors.ts");
/* harmony import */ var _redux_config_configActions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../redux/config/configActions */ "./public/redux/config/configActions.ts");
/* harmony import */ var _redux_types__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../redux/types */ "./public/redux/types.ts");
/* harmony import */ var _initPage__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./initPage */ "./public/components/initPage.tsx");
/* harmony import */ var _homePage__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./homePage */ "./public/components/homePage.tsx");
/* harmony import */ var _alarmsPage__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./alarmsPage */ "./public/components/alarmsPage.tsx");
/* harmony import */ var _credentialsPage__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./credentialsPage */ "./public/components/credentialsPage.tsx");
/* harmony import */ var _downloadsPage__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./downloadsPage */ "./public/components/downloadsPage.tsx");
/* harmony import */ var _implantsPage__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./implantsPage */ "./public/components/implantsPage.tsx");
/* harmony import */ var _rtopsPage__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./rtopsPage */ "./public/components/rtopsPage.tsx");
/* harmony import */ var _screenshotsPage__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./screenshotsPage */ "./public/components/screenshotsPage.tsx");
/* harmony import */ var _tasksPage__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./tasksPage */ "./public/components/tasksPage.tsx");
/* harmony import */ var _trafficPage__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./trafficPage */ "./public/components/trafficPage.tsx");
/* harmony import */ var _ttpPage__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./ttpPage */ "./public/components/ttpPage.tsx");
/* harmony import */ var _attackNavigatorPage__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./attackNavigatorPage */ "./public/components/attackNavigatorPage.tsx");
/* harmony import */ var _helpers_settings_helper__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../helpers/settings_helper */ "./public/helpers/settings_helper.ts");






























const {
  Provider: AppStateContainerProvider,
  useState: useAppState,
  useContainer: useAppStateContainer
} = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__["createStateContainerReactHelpers"])();

const useIndexPattern = data => {
  const [indexPattern, setIndexPattern] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])();
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
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
};

const useCreateStateContainer = defaultState => {
  const stateContainerRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(null);

  if (!stateContainerRef.current) {
    stateContainerRef.current = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__["createStateContainer"])(defaultState);
  }

  return stateContainerRef.current;
};

const useGlobalStateSyncing = (query, kbnUrlStateStorage) => {
  // setup sync state utils
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // sync global filters, time filters, refresh interval from data.query to url '_g'
    const {
      stop
    } = Object(_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__["syncQueryStateWithUrl"])(query, kbnUrlStateStorage);
    return () => {
      stop();
    };
  }, [query, kbnUrlStateStorage]);
};

const useAppStateSyncing = (appStateContainer, query, kbnUrlStateStorage) => {
  // setup sync state utils
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // sync app filters with app state container from data.query to state container
    const stopSyncingQueryAppStateWithStateContainer = Object(_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__["connectToQueryState"])(query, appStateContainer, {
      filters: _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__["esFilters"].FilterStateStore.APP_STATE,
      time: true
    }); // sets up syncing app state container with url

    const {
      start: startSyncingAppStateWithUrl,
      stop: stopSyncingAppStateWithUrl
    } = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_9__["syncState"])({
      storageKey: '_a',
      stateStorage: kbnUrlStateStorage,
      stateContainer: { ...appStateContainer,
        // stateSync utils requires explicit handling of default state ("null")
        set: state => state && appStateContainer.set(state)
      }
    }); // merge initial state from app state container and current state in url

    const initialAppState = { ...appStateContainer.get(),
      ...kbnUrlStateStorage.get('_a')
    }; // trigger state update. actually needed in case some data was in url

    appStateContainer.set(initialAppState); // set current url to whatever is in app state container

    kbnUrlStateStorage.set('_a', initialAppState); // finally start syncing state containers with url

    startSyncingAppStateWithUrl();
    return () => {
      stopSyncingQueryAppStateWithStateContainer();
      stopSyncingAppStateWithUrl();
    };
  }, [query, kbnUrlStateStorage, appStateContainer]);
};

const RedelkAppInternal = ({
  basename,
  navigation,
  data,
  core,
  history,
  kbnUrlStateStorage
}) => {
  const {
    notifications,
    http
  } = core;
  const appStateContainer = useAppStateContainer();
  const appState = useAppState();
  const showTopNav = Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_14__["getShowTopNav"]);
  const currentRoute = Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_14__["getCurrentRoute"]);
  const initStatus = Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_14__["getInitStatus"]);
  const topNavMenu = Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_14__["getTopNavMenu"]);
  const [currentPageTitle, setCurrentPageTitle] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_routes__WEBPACK_IMPORTED_MODULE_11__["routes"].find(r => r.id === _routes__WEBPACK_IMPORTED_MODULE_11__["DEFAULT_ROUTE_ID"]).name);
  const [isPopoverOpen, setPopover] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);

  const onButtonClick = () => {
    setPopover(!isPopoverOpen);
  };

  const closePopover = () => {
    setPopover(false);
  };

  useGlobalStateSyncing(data.query, kbnUrlStateStorage);
  useAppStateSyncing(appStateContainer, data.query, kbnUrlStateStorage);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (location.pathname !== currentRoute) {
      dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_10__["ActionCreators"].setCurrentRoute(location.pathname));
    }

    Object(_helpers_settings_helper__WEBPACK_IMPORTED_MODULE_29__["initSettings"])(core);
  }); // BEGIN top drop-down menu

  const button = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiButtonEmpty"], {
    size: "s",
    iconType: "arrowDown",
    iconSide: "right",
    onClick: onButtonClick
  }, currentPageTitle); // Listen to the appState and update menu links

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    var _routes$find;

    // Quick and dirty... TODO: prepend basePath to r.path
    const tmp = ((_routes$find = _routes__WEBPACK_IMPORTED_MODULE_11__["routes"].find(r => location.pathname.includes(r.path))) === null || _routes$find === void 0 ? void 0 : _routes$find.name) || "Loading";
    setCurrentPageTitle(tmp);
  }, [currentRoute]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    let items;
    items = _routes__WEBPACK_IMPORTED_MODULE_11__["routes"].map(r => {
      const generator = new _helpers_url_generator__WEBPACK_IMPORTED_MODULE_12__["RedelkURLGenerator"]({
        appBasePath: r.path,
        useHash: false
      });
      let path = generator.createUrl(appState); //console.log('url', path, appState, appStateContainer);

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiContextMenuItem"], {
        key: r.id,
        icon: r.icon,
        onClick: () => {
          closePopover();
          setCurrentPageTitle(r.name);
          history.push(path);
        }
      }, r.name);
    });
    const breadcrumbs = [{
      href: core.application.getUrlForApp(_common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]),
      onClick: e => {
        core.application.navigateToApp(_common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"], {
          path: _routes__WEBPACK_IMPORTED_MODULE_11__["routes"].find(r => r.id === _routes__WEBPACK_IMPORTED_MODULE_11__["DEFAULT_ROUTE_ID"]).path || "/",
          state: appState
        });
        e.preventDefault();
      },
      text: _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"]
    }, {
      onClick: e => {},
      text: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiPopover"], {
        id: "singlePanel",
        button: button,
        isOpen: isPopoverOpen,
        closePopover: closePopover,
        panelPaddingSize: "none",
        anchorPosition: "downLeft"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiContextMenuPanel"], {
        items: items
      }))
    }];
    Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_5__["setNavHeader"])(core, breadcrumbs);
  }, [appState.time, appState.query, appState.filters, history.location, data.query, currentRoute]);
  const onQuerySubmit = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(({
    query,
    dateRange
  }) => {
    appStateContainer.set({ ...appState,
      query,
      time: dateRange
    });
    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_10__["ActionCreators"].setAppState({ ...appState,
      query,
      time: dateRange
    }));
  }, [appStateContainer, appState]);
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["useDispatch"])(); // Build ES query and fetch data

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_10__["ActionCreators"].setStatus(_types__WEBPACK_IMPORTED_MODULE_13__["KbnCallStatus"].pending));
    let tmpFilters = appState.filters ? [...appState.filters] : [];

    if (appState.time !== undefined) {
      const trFilter = Object(_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__["getTime"])(indexPattern, appState.time);

      if (trFilter !== undefined) {
        tmpFilters.push(trFilter);
      }
    }

    const esQueryFilters = _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_8__["esQuery"].buildQueryFromFilters(tmpFilters, indexPattern);
    let searchOpts = {
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
      } // If the state contains a filter


      if (appState.filters !== undefined || appState.time !== undefined) {
        searchOpts.params.body.query = {
          bool: esQueryFilters
        };
      }
    }

    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_10__["ActionCreators"].fetchAllRtops({
      data,
      searchOpts
    }));
  }, [appState.filters, appState.query, appState.time, currentRoute]);
  const indexPattern = useIndexPattern(data);

  if (initStatus === _types__WEBPACK_IMPORTED_MODULE_13__["RedelkInitStatus"].idle) {
    dispatch(Object(_redux_config_configActions__WEBPACK_IMPORTED_MODULE_15__["checkInit"])(http));
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_initPage__WEBPACK_IMPORTED_MODULE_17__["InitPage"], {
      title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Loading ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"]),
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiLoadingSpinner"], {
        size: "xl"
      }), " Waiting for ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"], " initialization to start.")
    });
  }

  if (initStatus === _types__WEBPACK_IMPORTED_MODULE_13__["RedelkInitStatus"].pending) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_initPage__WEBPACK_IMPORTED_MODULE_17__["InitPage"], {
      title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Loading ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"]),
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiLoadingSpinner"], {
        size: "xl"
      }), " Waiting for ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"], " initialization to complete.")
    });
  }

  if (initStatus === _types__WEBPACK_IMPORTED_MODULE_13__["RedelkInitStatus"].failure) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_initPage__WEBPACK_IMPORTED_MODULE_17__["InitPage"], {
      title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Error loading ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"]),
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "ERROR: --")
    });
  }

  if (!indexPattern) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_initPage__WEBPACK_IMPORTED_MODULE_17__["InitPage"], {
      title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Error loading ", _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_NAME"]),
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "No default index pattern found. Please set the default index pattern to \"rtops-*\".")
    });
  }

  const topNav = showTopNav ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(navigation.ui.TopNavMenu, {
    appName: _common__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"],
    showSearchBar: true,
    indexPatterns: [indexPattern],
    useDefaultBehaviors: true,
    onQuerySubmit: onQuerySubmit,
    query: appState.query,
    showSaveQuery: true,
    config: topNavMenu
  }) : '';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Router"], {
    history: history
  }, topNav, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/",
    exact: true,
    render: () => {
      var _routes$find2;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
        to: ((_routes$find2 = _routes__WEBPACK_IMPORTED_MODULE_11__["routes"].find(r => r.id === _routes__WEBPACK_IMPORTED_MODULE_11__["DEFAULT_ROUTE_ID"])) === null || _routes$find2 === void 0 ? void 0 : _routes$find2.path) || "/home"
      });
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/home",
    exact: true,
    component: _homePage__WEBPACK_IMPORTED_MODULE_18__["HomePage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/alarms",
    exact: true,
    component: _alarmsPage__WEBPACK_IMPORTED_MODULE_19__["AlarmsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/credentials",
    exact: true,
    component: _credentialsPage__WEBPACK_IMPORTED_MODULE_20__["CredentialsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/downloads",
    exact: true,
    component: _downloadsPage__WEBPACK_IMPORTED_MODULE_21__["DownloadsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/implants",
    exact: true,
    component: _implantsPage__WEBPACK_IMPORTED_MODULE_22__["ImplantsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/rtops",
    exact: true,
    component: _rtopsPage__WEBPACK_IMPORTED_MODULE_23__["RtopsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/screenshots",
    exact: true,
    component: _screenshotsPage__WEBPACK_IMPORTED_MODULE_24__["ScreenshotsPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/tasks",
    exact: true,
    component: _tasksPage__WEBPACK_IMPORTED_MODULE_25__["TasksPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/traffic",
    exact: true,
    component: _trafficPage__WEBPACK_IMPORTED_MODULE_26__["TrafficPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/ttp",
    exact: true,
    component: _ttpPage__WEBPACK_IMPORTED_MODULE_27__["TTPPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/attack-navigator",
    exact: true,
    component: _attackNavigatorPage__WEBPACK_IMPORTED_MODULE_28__["AttackNavigatorPage"]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/summary",
    exact: true,
    render: () => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_summaryPage__WEBPACK_IMPORTED_MODULE_3__["SummaryPage"], {
      basename: basename,
      notifications: notifications,
      http: http,
      navigation: navigation
    })
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/ioc",
    render: () => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_iocPage__WEBPACK_IMPORTED_MODULE_2__["IOCPage"], {
      basename: basename,
      notifications: notifications,
      http: http,
      navigation: navigation,
      data: data
    })
  }));
};

const RedelkApp = props => {
  const appStateContainer = useCreateStateContainer(_redux_types__WEBPACK_IMPORTED_MODULE_16__["defaultAppState"]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AppStateContainerProvider, {
    value: appStateContainer
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RedelkAppInternal, props));
};

/***/ }),

/***/ "./public/components/attackNavigatorPage.tsx":
/*!***************************************************!*\
  !*** ./public/components/attackNavigatorPage.tsx ***!
  \***************************************************/
/*! exports provided: AttackNavigatorPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AttackNavigatorPage", function() { return AttackNavigatorPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");


const Iframe = /*#__PURE__*/Object(react__WEBPACK_IMPORTED_MODULE_0__["memo"])(() => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("iframe", {
  src: "/plugins/redelk/assets/attack-navigator/",
  width: "100%",
  height: "100%"
}));
const AttackNavigatorPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(false);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "iframe-wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Iframe, null));
};

/***/ }),

/***/ "./public/components/credentialsPage.tsx":
/*!***********************************************!*\
  !*** ./public/components/credentialsPage.tsx ***!
  \***********************************************/
/*! exports provided: CredentialsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CredentialsPage", function() { return CredentialsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const CredentialsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "82b865a0-d318-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/downloadsPage.tsx":
/*!*********************************************!*\
  !*** ./public/components/downloadsPage.tsx ***!
  \*********************************************/
/*! exports provided: DownloadsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadsPage", function() { return DownloadsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const DownloadsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "643de010-d04c-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/embeddedDashboard.tsx":
/*!*************************************************!*\
  !*** ./public/components/embeddedDashboard.tsx ***!
  \*************************************************/
/*! exports provided: EmbeddedDashboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmbeddedDashboard", function() { return EmbeddedDashboard; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _redux_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../redux/selectors */ "./public/redux/selectors.ts");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers_dashboard_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/dashboard_helper */ "./public/helpers/dashboard_helper.ts");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../src/plugins/kibana_react/public */ "plugin/kibanaReact/public");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _redux_rootActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../redux/rootActions */ "./public/redux/rootActions.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);







const EmbeddedDashboard = ({
  dashboardId,
  extraTopNavMenu
}) => {
  const [dashboardDef, setDashboardDef] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])();
  const [dashboardConfig, setDashboardConfig] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(); // const [dashboard, setDashboard] = useState<ReactElement>(<p>Loading dashboard</p>);

  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["useDispatch"])();
  const {
    services
  } = Object(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_4__["useKibana"])();
  const appState = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_1__["getAppState"]);
  const rtopsLastRefreshDate = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_1__["getRtopsLastRefreshDate"]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    let topNav = [{
      id: "go-to-dashboard",
      label: "Open in dashboard app",
      run: () => {
        var _services$application;

        (_services$application = services.application) === null || _services$application === void 0 ? void 0 : _services$application.navigateToApp('dashboards', {
          path: "#/view/" + dashboardId
        });
      }
    }];

    if (extraTopNavMenu !== undefined) {
      topNav = Object(lodash__WEBPACK_IMPORTED_MODULE_6__["concat"])(topNav, extraTopNavMenu);
    }

    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_5__["ActionCreators"].setTopNavMenu(topNav));
    return () => {
      dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_5__["ActionCreators"].setTopNavMenu([]));
    };
  }, []);
  let dashboard;
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (dashboardDef !== undefined) {
      setDashboardConfig(Object(_helpers_dashboard_helper__WEBPACK_IMPORTED_MODULE_3__["savedObjectToDashboardContainerInput"])(dashboardDef, appState, rtopsLastRefreshDate));
    }
  }, [dashboardDef, appState, rtopsLastRefreshDate]);

  if (dashboardConfig) {
    dashboard = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(services.dashboard.DashboardContainerByValueRenderer, {
      input: dashboardConfig,
      onInputUpdated: setDashboardConfig
    });
  }

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    var _services$savedObject, _services$savedObject2;

    (_services$savedObject = services.savedObjects) === null || _services$savedObject === void 0 ? void 0 : (_services$savedObject2 = _services$savedObject.client) === null || _services$savedObject2 === void 0 ? void 0 : _services$savedObject2.get("dashboard", dashboardId).then(res => {
      setDashboardDef(res);
    });
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "dashboardPage"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "dashboardViewport"
  }, dashboard));
};

/***/ }),

/***/ "./public/components/homePage.tsx":
/*!****************************************!*\
  !*** ./public/components/homePage.tsx ***!
  \****************************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const HomePage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "02486040-d355-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/implantsPage.tsx":
/*!********************************************!*\
  !*** ./public/components/implantsPage.tsx ***!
  \********************************************/
/*! exports provided: ImplantsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImplantsPage", function() { return ImplantsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const ImplantsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "117dbba0-c6f5-11e8-a9c6-cd307b96b1ba"
  }));
};

/***/ }),

/***/ "./public/components/initPage.tsx":
/*!****************************************!*\
  !*** ./public/components/initPage.tsx ***!
  \****************************************/
/*! exports provided: InitPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitPage", function() { return InitPage; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const InitPage = ({
  title,
  content
}) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageBody"], {
    component: "div"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageContent"], {
    verticalPosition: "center",
    horizontalPosition: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageContentHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageContentHeaderSection"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], null, title))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageContentBody"], null, content))));
};

/***/ }),

/***/ "./public/components/iocPage.tsx":
/*!***************************************!*\
  !*** ./public/components/iocPage.tsx ***!
  \***************************************/
/*! exports provided: IOCPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IOCPage", function() { return IOCPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _features_rtops_addIocForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../features/rtops/addIocForm */ "./public/features/rtops/addIocForm.tsx");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _redux_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../redux/selectors */ "./public/redux/selectors.ts");
/* harmony import */ var _redux_rootActions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../redux/rootActions */ "./public/redux/rootActions.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");








const IOCPage = ({
  basename,
  notifications,
  http,
  navigation,
  data
}) => {
  const showAddIOCForm = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_5__["getRtopsShowAddIOCForm"]);
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_4__["useTopNav"])(true);
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["useDispatch"])();
  let addIOCFlyout;

  if (showAddIOCForm) {
    addIOCFlyout = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlyout"], {
      size: "m",
      onClose: () => dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_6__["ActionCreators"].setShowAddIOCForm(false)),
      "aria-labelledby": "flyoutTitle"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlyoutHeader"], {
      hasBorder: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
      size: "m"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      id: "flyoutTitle"
    }, "Add an IOC"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlyoutBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_features_rtops_addIocForm__WEBPACK_IMPORTED_MODULE_2__["AddIOCForm"], {
      http: http
    })));
  }

  const addIOCNavMenu = {
    id: "add-ioc",
    label: "Add IOC",
    run: () => {
      dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_6__["ActionCreators"].setShowAddIOCForm(true));
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, addIOCFlyout, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_7__["EmbeddedDashboard"], {
    dashboardId: "86643e90-d4e4-11ea-9301-a30a04251ae9",
    extraTopNavMenu: [addIOCNavMenu]
  }));
};

/***/ }),

/***/ "./public/components/rtopsPage.tsx":
/*!*****************************************!*\
  !*** ./public/components/rtopsPage.tsx ***!
  \*****************************************/
/*! exports provided: RtopsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RtopsPage", function() { return RtopsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const RtopsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "04b87c50-d028-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/screenshotsPage.tsx":
/*!***********************************************!*\
  !*** ./public/components/screenshotsPage.tsx ***!
  \***********************************************/
/*! exports provided: ScreenshotsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenshotsPage", function() { return ScreenshotsPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const ScreenshotsPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "a2dcebf0-d316-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/summaryPage.tsx":
/*!*******************************************!*\
  !*** ./public/components/summaryPage.tsx ***!
  \*******************************************/
/*! exports provided: SummaryPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SummaryPage", function() { return SummaryPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types */ "./public/types.ts");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _elastic_charts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/charts */ "@elastic/charts");
/* harmony import */ var _elastic_charts__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @elastic/eui/dist/eui_charts_theme */ "@elastic/eui/dist/eui_charts_theme");
/* harmony import */ var _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _redux_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../redux/selectors */ "./public/redux/selectors.ts");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../src/plugins/kibana_react/public */ "plugin/kibanaReact/public");
/* harmony import */ var _src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__);









const SummaryPage = ({
  basename,
  notifications,
  http,
  navigation
}) => {
  var _kibana$services$uiSe, _rtopsAggs$perHostNam, _rtopsAggs$perHostNam2, _rtopsAggs$perUserNam, _rtopsAggs$perUserNam2, _rtopsAggs$perEventTy, _rtopsAggs$perEventTy2, _rtopsAggs$perEventTy3, _rtopsAggs$perEventTy4, _rtopsAggs$perEventTy5, _rtopsAggs$perEventTy6, _rtopsAggs$perImplant, _rtopsAggs$perImplant2;

  const rtopsStatus = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_7__["getRtopsStatus"]);
  const rtopsAggs = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["useSelector"])(_redux_selectors__WEBPACK_IMPORTED_MODULE_7__["getRtopsAggs"]);
  const kibana = Object(_src_plugins_kibana_react_public__WEBPACK_IMPORTED_MODULE_8__["useKibana"])();
  const isDarkMode = ((_kibana$services$uiSe = kibana.services.uiSettings) === null || _kibana$services$uiSe === void 0 ? void 0 : _kibana$services$uiSe.get("theme:darkMode")) && true;
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_6__["useTopNav"])(true);
  let perEventTypeChart = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, "No data");
  let perHostNameChart = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, "No data");

  if (rtopsAggs.perEventType && rtopsAggs.perHostName && rtopsAggs.perUserName) {
    const perEventTypeData = rtopsAggs.perEventType.buckets;
    const perHostNameData = rtopsAggs.perHostName.buckets;
    perEventTypeChart = rtopsStatus !== _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Chart"], {
      size: {
        height: 300
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Settings"], {
      theme: isDarkMode ? _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__["EUI_CHARTS_THEME_DARK"].theme : _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__["EUI_CHARTS_THEME_LIGHT"].theme,
      rotation: 90,
      showLegend: false,
      legendPosition: "right"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["BarSeries"], {
      id: "perEventType",
      name: "Event type",
      data: perEventTypeData,
      xAccessor: "key",
      yAccessors: ['doc_count'],
      color: Object(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["euiPaletteColorBlind"])({
        rotations: 2,
        order: 'group'
      }).slice(1, 20)
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Axis"], {
      id: "bottom-axis",
      position: 'left'
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Axis"], {
      id: "left-axis",
      showGridLines: true,
      position: 'bottom'
    })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLoadingSpinner"], {
      size: "xl"
    });
    perHostNameChart = rtopsStatus !== _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Chart"], {
      size: {
        height: 300
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Settings"], {
      theme: isDarkMode ? _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__["EUI_CHARTS_THEME_DARK"].theme : _elastic_eui_dist_eui_charts_theme__WEBPACK_IMPORTED_MODULE_5__["EUI_CHARTS_THEME_LIGHT"].theme,
      showLegend: true,
      legendPosition: "right"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_4__["Partition"], {
      id: "perHostName",
      data: perHostNameData,
      valueAccessor: d => Number(d.doc_count),
      layers: [{
        groupByRollup: d => d.key,
        shape: {
          fillColor: d => Object(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["euiPaletteColorBlind"])().slice(d.sortIndex, d.sortIndex + 1)[0]
        }
      }],
      config: {
        emptySizeRatio: 0.4,
        clockwiseSectors: false
      }
    })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLoadingSpinner"], {
      size: "xl"
    });
  } // const VISUALIZATIONS = [
  //   {
  //     name: "hosts",
  //     id: "b19d4790-d35f-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "credentials",
  //     id: "dcf86190-d319-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "downloads",
  //     id: "b5beb3c0-d04b-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "screenshots",
  //     id: "389dddc0-d317-11ea-9301-a30a04251ae9"
  //   }
  // ]
  // console.log(kibana.services.visualizations.get("metric"));
  // useEffect(() => {
  //   const embFact: EmbeddableFactory = kibana.services.embeddable.getEmbeddableFactory("visualization");
  //   VISUALIZATIONS.forEach(viz => {
  //     embFact.createFromSavedObject(viz.id, {
  //       id: viz.id + '-' + viz.name,
  //       viewMode: ViewMode.VIEW,
  //       lastReloadRequestTime: 0
  //     }).then(res => {
  //       console.log("embed", res);
  //       const vizEmb = res as VisualizeEmbeddable;
  //       const elem = window.document.getElementById("summary-embedded-viz-" + viz.name);
  //       if (elem) {
  //         elem.innerHTML = "";
  //         console.log('Rendering viz: ' + viz.name);
  //         vizEmb.render(elem);
  //       }
  //     })
  //   })
  // }, [ioc]);
  // const embeddedViz = (
  //   <EuiFlexGroup>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-hosts"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-credentials"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-downloads"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-screenshots"></div>
  //     </EuiFlexItem>
  //   </EuiFlexGroup>
  // );


  const totalHosts = (rtopsAggs === null || rtopsAggs === void 0 ? void 0 : (_rtopsAggs$perHostNam = rtopsAggs.perHostName) === null || _rtopsAggs$perHostNam === void 0 ? void 0 : (_rtopsAggs$perHostNam2 = _rtopsAggs$perHostNam.buckets) === null || _rtopsAggs$perHostNam2 === void 0 ? void 0 : _rtopsAggs$perHostNam2.length) || 0;
  const totalUsers = (rtopsAggs === null || rtopsAggs === void 0 ? void 0 : (_rtopsAggs$perUserNam = rtopsAggs.perUserName) === null || _rtopsAggs$perUserNam === void 0 ? void 0 : (_rtopsAggs$perUserNam2 = _rtopsAggs$perUserNam.buckets) === null || _rtopsAggs$perUserNam2 === void 0 ? void 0 : _rtopsAggs$perUserNam2.length) || 0;
  const totalIOC = (rtopsAggs === null || rtopsAggs === void 0 ? void 0 : (_rtopsAggs$perEventTy = rtopsAggs.perEventType) === null || _rtopsAggs$perEventTy === void 0 ? void 0 : (_rtopsAggs$perEventTy2 = _rtopsAggs$perEventTy.buckets) === null || _rtopsAggs$perEventTy2 === void 0 ? void 0 : (_rtopsAggs$perEventTy3 = _rtopsAggs$perEventTy2.filter(v => v.key === "ioc")[0]) === null || _rtopsAggs$perEventTy3 === void 0 ? void 0 : _rtopsAggs$perEventTy3.doc_count) || 0;
  const totalDownloads = (rtopsAggs === null || rtopsAggs === void 0 ? void 0 : (_rtopsAggs$perEventTy4 = rtopsAggs.perEventType) === null || _rtopsAggs$perEventTy4 === void 0 ? void 0 : (_rtopsAggs$perEventTy5 = _rtopsAggs$perEventTy4.buckets) === null || _rtopsAggs$perEventTy5 === void 0 ? void 0 : (_rtopsAggs$perEventTy6 = _rtopsAggs$perEventTy5.filter(v => v.key === "downloads")[0]) === null || _rtopsAggs$perEventTy6 === void 0 ? void 0 : _rtopsAggs$perEventTy6.doc_count) || 0;
  const totalImplants = (rtopsAggs === null || rtopsAggs === void 0 ? void 0 : (_rtopsAggs$perImplant = rtopsAggs.perImplant) === null || _rtopsAggs$perImplant === void 0 ? void 0 : (_rtopsAggs$perImplant2 = _rtopsAggs$perImplant.buckets) === null || _rtopsAggs$perImplant2 === void 0 ? void 0 : _rtopsAggs$perImplant2.length) || 0;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "Alarms",
    betaBadgeTooltipContent: "Go to Alarms dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl;

      return (_kibana$services$appl = kibana.services.application) === null || _kibana$services$appl === void 0 ? void 0 : _kibana$services$appl.navigateToApp('dashboards', {
        path: "#/view/53b69200-d4e3-11ea-9301-a30a04251ae9"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: "--",
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "alert"
    }), " Alarms"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "Implants",
    betaBadgeTooltipContent: "Go to Implants dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl2;

      return (_kibana$services$appl2 = kibana.services.application) === null || _kibana$services$appl2 === void 0 ? void 0 : _kibana$services$appl2.navigateToApp('dashboards', {
        path: "#/view/117dbba0-c6f5-11e8-a9c6-cd307b96b1ba"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: totalImplants,
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "bug"
    }), " Implants"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "IOC",
    betaBadgeTooltipContent: "Go to IOC dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl3;

      return (_kibana$services$appl3 = kibana.services.application) === null || _kibana$services$appl3 === void 0 ? void 0 : _kibana$services$appl3.navigateToApp('dashboards', {
        path: "#/view/86643e90-d4e4-11ea-9301-a30a04251ae9"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: totalIOC,
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "securitySignal"
    }), " IOC"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "Downloads",
    betaBadgeTooltipContent: "Go to Downloads dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl4;

      return (_kibana$services$appl4 = kibana.services.application) === null || _kibana$services$appl4 === void 0 ? void 0 : _kibana$services$appl4.navigateToApp('dashboards', {
        path: "#/view/643de010-d04c-11ea-9301-a30a04251ae9"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: totalDownloads,
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "download"
    }), " Downloads"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "Red Team Operations",
    betaBadgeTooltipContent: "Go to Red Team Operations dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl5;

      return (_kibana$services$appl5 = kibana.services.application) === null || _kibana$services$appl5 === void 0 ? void 0 : _kibana$services$appl5.navigateToApp('dashboards', {
        path: "#/view/04b87c50-d028-11ea-9301-a30a04251ae9"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: totalHosts,
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "grid"
    }), " Hosts"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiKeyPadMenuItem"], {
    label: "",
    className: "redelk-stat-menu-item",
    betaBadgeLabel: "Red Team Operations",
    betaBadgeTooltipContent: "Go to Red Team Operations dashboard.",
    betaBadgeIconType: "popout",
    onClick: () => {
      var _kibana$services$appl6;

      return (_kibana$services$appl6 = kibana.services.application) === null || _kibana$services$appl6 === void 0 ? void 0 : _kibana$services$appl6.navigateToApp('dashboards', {
        path: "#/view/04b87c50-d028-11ea-9301-a30a04251ae9"
      });
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: totalUsers,
    description: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "users"
    }), " Users"),
    textAlign: "left",
    reverse: true,
    isLoading: rtopsStatus === _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "s"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Event type")), perEventTypeChart), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "s"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Hostnames")), perHostNameChart)))));
};

/***/ }),

/***/ "./public/components/tasksPage.tsx":
/*!*****************************************!*\
  !*** ./public/components/tasksPage.tsx ***!
  \*****************************************/
/*! exports provided: TasksPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TasksPage", function() { return TasksPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const TasksPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "0523c8a0-d025-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/components/trafficPage.tsx":
/*!*******************************************!*\
  !*** ./public/components/trafficPage.tsx ***!
  \*******************************************/
/*! exports provided: TrafficPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrafficPage", function() { return TrafficPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const TrafficPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "0f8626d0-c6f4-11e8-a9c6-cd307b96b1ba"
  }));
};

/***/ }),

/***/ "./public/components/ttpPage.tsx":
/*!***************************************!*\
  !*** ./public/components/ttpPage.tsx ***!
  \***************************************/
/*! exports provided: TTPPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TTPPage", function() { return TTPPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/nav_header_helper */ "./public/helpers/nav_header_helper.ts");
/* harmony import */ var _embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embeddedDashboard */ "./public/components/embeddedDashboard.tsx");



const TTPPage = () => {
  Object(_helpers_nav_header_helper__WEBPACK_IMPORTED_MODULE_1__["useTopNav"])(true);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_embeddedDashboard__WEBPACK_IMPORTED_MODULE_2__["EmbeddedDashboard"], {
    dashboardId: "3ed7a630-d051-11ea-9301-a30a04251ae9"
  }));
};

/***/ }),

/***/ "./public/features/rtops/addIocForm.tsx":
/*!**********************************************!*\
  !*** ./public/features/rtops/addIocForm.tsx ***!
  \**********************************************/
/*! exports provided: AddIOCForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddIOCForm", function() { return AddIOCForm; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _redux_rootActions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../redux/rootActions */ "./public/redux/rootActions.ts");





const AddIOCForm = ({
  http
}) => {
  const md5Regexp = /^[a-fA-F0-9]{32}$/;
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["useDispatch"])();
  const [iocType, setIocType] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [timestamp, setTimestamp] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(moment__WEBPACK_IMPORTED_MODULE_2___default()());
  const [c2Message, setC2Message] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [userName, setUserName] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [hostName, setHostName] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [fileName, setFileName] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [fileHash, setFileHash] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [fileSize, setFileSize] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [domainName, setDomainName] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const isFileHashValid = iocType !== 'file' || md5Regexp.test(fileHash);
  const isFileNameValid = fileName.length > 0;
  const isDomainNameValid = iocType !== "domain" || domainName !== "";
  const fileNameErrors = [!isFileNameValid ? 'File name is required' : ''];
  const fileHashErrors = ['Invalid file hash'];
  const domainNameErrors = [!isDomainNameValid ? 'Domain name is required' : ''];

  const handleFormSubmit = e => {
    const payload = {
      '@timestamp': timestamp.toISOString(),
      ioc: {
        type: iocType,
        domain: domainName
      },
      file: {
        name: fileName,
        size: fileSize,
        hash: {
          md5: fileHash
        }
      },
      c2: {
        message: c2Message
      },
      host: {
        name: hostName
      },
      user: {
        name: userName
      }
    };
    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_4__["ActionCreators"].createIOC({
      http,
      payload
    }));
    e.preventDefault();
    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_4__["ActionCreators"].setShowAddIOCForm(false));
  };

  const handleTypeChange = e => {
    setIocType(e.target.value);
  }; // Common to all IOC types


  const handleUserNameChange = e => {
    setUserName(e.target.value);
  };

  const handleHostNameChange = e => {
    setHostName(e.target.value);
  };

  const handleC2MessageChange = e => {
    setC2Message(e.target.value);
  };

  const handleTimestampChange = date => {
    setTimestamp(date);
  }; // File / Service


  const handleFileNameChange = e => {
    setFileName(e.target.value);
  };

  const handleFileHashChange = e => {
    setFileHash(e.target.value);
  };

  const handleFileSizeChange = e => {
    setFileSize(e.target.value);
  }; // Domain


  const handleDomainNameChange = e => {
    setDomainName(e.target.value);
  };

  const timestampFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "Timestamp (required)",
    helpText: "When has the IOC been seen?"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiDatePicker"], {
    showTimeSelect: true,
    selected: timestamp,
    onChange: handleTimestampChange,
    timeIntervals: 1
  }));
  const fileNameFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "File name (required)",
    helpText: "Name of the file related to the IOC.",
    error: fileNameErrors,
    isInvalid: !isFileNameValid
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "fileName",
    onChange: handleFileNameChange,
    isInvalid: !isFileNameValid
  }));
  const fileHashFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "File hash (MD5)",
    helpText: "MD5 hash of the file related to the IOC.",
    error: fileHashErrors,
    isInvalid: !isFileHashValid
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "fileHash",
    onChange: handleFileHashChange,
    isInvalid: !isFileHashValid
  }));
  const fileSizeFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "File size",
    helpText: "Size of the file related to the IOC (in bytes)."
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldNumber"], {
    name: "fileSize",
    onChange: handleFileSizeChange
  }));
  const userNameFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "User name",
    helpText: "Optional name of the target user where the IOC occurred."
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "userName",
    onChange: handleUserNameChange
  }));
  const hostNameFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "Host name",
    helpText: "Optional name of the target host where the IOC occurred."
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "hostName",
    onChange: handleHostNameChange
  }));
  const c2MessageFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "C2 Message",
    helpText: "Optional message that will be populated in the `c2.message` field."
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "c2Message",
    onChange: handleC2MessageChange
  }));
  const domainNameFormRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "Domain name",
    helpText: "Domain name that will be populated in the `ioc.domain` field.",
    error: domainNameErrors,
    isInvalid: !isDomainNameValid
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFieldText"], {
    name: "domainName",
    onChange: handleDomainNameChange,
    isInvalid: !isDomainNameValid
  }));
  const fileForm = iocType === 'file' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, timestampFormRow, fileNameFormRow, fileHashFormRow, fileSizeFormRow, userNameFormRow, hostNameFormRow, c2MessageFormRow) : '';
  const serviceForm = iocType === 'service' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, timestampFormRow, fileNameFormRow, fileHashFormRow, fileSizeFormRow, userNameFormRow, hostNameFormRow, c2MessageFormRow) : '';
  const domainForm = iocType === 'domain' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, timestampFormRow, userNameFormRow, hostNameFormRow, c2MessageFormRow, domainNameFormRow) : '';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiForm"], {
    component: "form",
    onSubmit: handleFormSubmit
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFormRow"], {
    label: "IOC Type",
    helpText: "Select the type of IOC to ingest."
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSelect"], {
    hasNoInitialSelection: true,
    onChange: handleTypeChange,
    options: [{
      value: '',
      text: ''
    }, {
      value: 'file',
      text: 'File'
    }, {
      value: 'service',
      text: 'Service'
    }, {
      value: 'domain',
      text: 'Domain'
    } // {value: 'ip', text: 'IP address'},
    ]
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], null), fileForm, serviceForm, domainForm, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiButton"], {
    type: "submit",
    fill: true,
    isDisabled: iocType === undefined
  }, "Add IOC"));
};

/***/ }),

/***/ "./public/helpers/dashboard_helper.ts":
/*!********************************************!*\
  !*** ./public/helpers/dashboard_helper.ts ***!
  \********************************************/
/*! exports provided: savedObjectToDashboardContainerInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "savedObjectToDashboardContainerInput", function() { return savedObjectToDashboardContainerInput; });
/* harmony import */ var _src_plugins_embeddable_public__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/plugins/embeddable/public */ "plugin/embeddable/public");
/* harmony import */ var _src_plugins_embeddable_public__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_embeddable_public__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);



const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

const savedObjectToDashboardContainerInput = (savedObj, appState, lastRefreshDate) => {
  const initialInput = {
    viewMode: _src_plugins_embeddable_public__WEBPACK_IMPORTED_MODULE_0__["ViewMode"].VIEW,
    panels: {
      '1': {
        gridData: {
          w: 10,
          h: 10,
          x: 0,
          y: 0,
          i: '1'
        },
        type: "visualization",
        explicitInput: {
          id: '1',
          savedObjectId: "b19d4790-d35f-11ea-9301-a30a04251ae9"
        }
      }
    },
    isFullScreenMode: false,
    filters: [],
    useMargins: false,
    id: uuidv4(),
    timeRange: {
      to: 'now',
      from: 'now-1y'
    },
    title: 'test',
    query: {
      query: '',
      language: 'lucene'
    },
    refreshConfig: {
      pause: true,
      value: 15
    }
  };

  if (savedObj !== undefined) {
    var _appState$time, _appState$time2;

    const panels = JSON.parse(savedObj.attributes.panelsJSON);
    let panelsOut = {};
    panels.forEach(p => {
      const pr = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["find"])(savedObj.references, r => r.name === p.panelRefName); // Don't show top menu bars for embedded dashboards

      if (pr && pr.id !== "0f82b540-d237-11ea-9301-a30a04251ae9" && pr.id !== "45491770-0886-11eb-a2d2-171dc8941414") {
        const tmpPanel = {
          gridData: p.gridData,
          type: pr.type,
          explicitInput: {
            id: p.panelIndex,
            savedObjectId: pr.id,
            ...p.embeddableConfig
          }
        };
        panelsOut[p.panelIndex] = tmpPanel;
      }
    });
    const dashboardOptions = JSON.parse(savedObj.attributes.optionsJSON || "");
    const dashboardConfig = {
      viewMode: _src_plugins_embeddable_public__WEBPACK_IMPORTED_MODULE_0__["ViewMode"].VIEW,
      panels: panelsOut,
      filters: appState.filters || [],
      useMargins: dashboardOptions.useMargins,
      id: savedObj.id,
      timeRange: {
        from: ((_appState$time = appState.time) === null || _appState$time === void 0 ? void 0 : _appState$time.from) || savedObj.attributes.timeFrom || "",
        to: ((_appState$time2 = appState.time) === null || _appState$time2 === void 0 ? void 0 : _appState$time2.to) || savedObj.attributes.timeTo || ""
      },
      title: savedObj.attributes.title,
      query: appState.query || {
        language: "kuery",
        query: ""
      },
      isFullScreenMode: false,
      refreshConfig: {
        pause: false,
        value: 5
      },
      lastReloadRequestTime: (lastRefreshDate === null || lastRefreshDate === void 0 ? void 0 : lastRefreshDate.getTime()) || new Date().getTime()
    };
    return dashboardConfig;
  }

  return initialInput;
};

/***/ }),

/***/ "./public/helpers/nav_header_helper.ts":
/*!*********************************************!*\
  !*** ./public/helpers/nav_header_helper.ts ***!
  \*********************************************/
/*! exports provided: setNavHeader, useTopNav */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setNavHeader", function() { return setNavHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useTopNav", function() { return useTopNav; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "../../node_modules/react-redux/lib/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common */ "./common/index.ts");
/* harmony import */ var _redux_rootActions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../redux/rootActions */ "./public/redux/rootActions.ts");




const setNavHeader = (core, breadcrumbs) => {
  const darkMode = core.uiSettings.get('theme:darkMode');
  const basePath = core.http.basePath.get();
  const iconType = basePath + '/plugins/redelk/assets/redelklogo' + (darkMode ? '-light' : '') + '.svg';
  const badge = {
    iconType: iconType,
    text: _common__WEBPACK_IMPORTED_MODULE_2__["PLUGIN_NAME"],
    tooltip: _common__WEBPACK_IMPORTED_MODULE_2__["PLUGIN_NAME"]
  };
  const brand = {
    logo: "url(" + iconType + ") center no-repeat",
    smallLogo: "url(" + iconType + ") center no-repeat"
  };
  const helpExtension = {
    appName: _common__WEBPACK_IMPORTED_MODULE_2__["PLUGIN_NAME"],
    links: [{
      linkType: 'documentation',
      href: 'https://github.com/fastlorenzo/redelk-kibana-app'
    }]
  }; //core.chrome.setHelpSupportUrl('https://github.com/fastlorenzo/redelk-kibana-app');

  core.chrome.setHelpExtension(helpExtension);
  core.chrome.setAppTitle(_common__WEBPACK_IMPORTED_MODULE_2__["PLUGIN_NAME"]);
  core.chrome.setBadge(badge);
  core.chrome.setBrand(brand);
  core.chrome.setBreadcrumbs(breadcrumbs);
};
const useTopNav = show => {
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["useDispatch"])();
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    dispatch(_redux_rootActions__WEBPACK_IMPORTED_MODULE_3__["ActionCreators"].setShowTopNav(show));
  });
};

/***/ }),

/***/ "./public/helpers/settings_helper.ts":
/*!*******************************************!*\
  !*** ./public/helpers/settings_helper.ts ***!
  \*******************************************/
/*! exports provided: initSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initSettings", function() { return initSettings; });
const initSettings = async core => {
  const defaultRoute = await core.uiSettings.get("defaultRoute");

  if (defaultRoute !== "/app/redelk/") {
    await core.uiSettings.set("theme:darkMode", true);
    await core.uiSettings.set("telemetry:optIn", false);
    await core.uiSettings.set("telemetry:enabled", false);
    await core.uiSettings.set("shortDots:enabled", true);
    await core.uiSettings.set("siem:enableNewsFeed", false);
    await core.uiSettings.set("siem:defaultIndex", ["apm-*-transaction*", "auditbeat-*", "endgame-*", "filebeat-*", "packetbeat-*", "winlogbeat-*", "rtops-*", "redirtraffic-*"]);
    await core.uiSettings.set("defaultIndex", "195a3f00-d04f-11ea-9301-a30a04251ae9");
    await core.uiSettings.set("defaultRoute", "/app/redelk/");
    window.location.reload();
  }
};

/***/ }),

/***/ "./public/helpers/url_generator.ts":
/*!*****************************************!*\
  !*** ./public/helpers/url_generator.ts ***!
  \*****************************************/
/*! exports provided: REDELK_APP_URL_GENERATOR, RedelkURLGenerator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REDELK_APP_URL_GENERATOR", function() { return REDELK_APP_URL_GENERATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedelkURLGenerator", function() { return RedelkURLGenerator; });
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/plugins/kibana_utils/public */ "plugin/kibanaUtils/public");
/* harmony import */ var _src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../src/plugins/data/public */ "plugin/data/public");
/* harmony import */ var _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_1__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const REDELK_APP_URL_GENERATOR = 'REDELK_APP_URL_GENERATOR';
class RedelkURLGenerator {
  constructor(params) {
    this.params = params;

    _defineProperty(this, "id", REDELK_APP_URL_GENERATOR);

    _defineProperty(this, "createUrl", ({
      filters,
      indexPatternId,
      query,
      refreshInterval,
      savedSearchId,
      time,
      useHash = this.params.useHash
    }) => {
      const savedSearchPath = savedSearchId ? encodeURIComponent(savedSearchId) : '';
      const appState = {};
      const queryState = {};
      if (query) appState.query = query;
      if (filters && filters.length) appState.filters = filters === null || filters === void 0 ? void 0 : filters.filter(f => !_src_plugins_data_public__WEBPACK_IMPORTED_MODULE_1__["esFilters"].isFilterPinned(f));
      if (indexPatternId) appState.index = indexPatternId;

      if (time) {
        queryState.time = time;
        appState.time = time;
      }

      if (filters && filters.length) queryState.filters = filters === null || filters === void 0 ? void 0 : filters.filter(f => _src_plugins_data_public__WEBPACK_IMPORTED_MODULE_1__["esFilters"].isFilterPinned(f));
      if (refreshInterval) queryState.refreshInterval = refreshInterval;
      let url = `${this.params.appBasePath}#/${savedSearchPath}`;
      url = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_0__["setStateToKbnUrl"])('_g', queryState, {
        useHash
      }, url);
      url = Object(_src_plugins_kibana_utils_public__WEBPACK_IMPORTED_MODULE_0__["setStateToKbnUrl"])('_a', appState, {
        useHash
      }, url);
      return url;
    });
  }

}

/***/ }),

/***/ "./public/middlewares/kbnApiMiddleware.ts":
/*!************************************************!*\
  !*** ./public/middlewares/kbnApiMiddleware.ts ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _redux_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../redux/types */ "./public/redux/types.ts");


const kbnApi = ({
  notifications,
  http
}) => {
  const kbnApiMiddleware = ({
    dispatch,
    getState
  }) => next => action => {
    //console.log('Called kbnApiMiddleware');
    //console.log(http);
    switch (action.type) {
      case _redux_types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].RTOPS_CREATE_IOC_REQUEST_SUCCESS:
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
  };

  return kbnApiMiddleware;
};

/* harmony default export */ __webpack_exports__["default"] = (kbnApi);

/***/ }),

/***/ "./public/redux/config/configActions.ts":
/*!**********************************************!*\
  !*** ./public/redux/config/configActions.ts ***!
  \**********************************************/
/*! exports provided: setShowTopNav, setCurrentRoute, checkInit, setAppState, setTopNavMenu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setShowTopNav", function() { return setShowTopNav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCurrentRoute", function() { return setCurrentRoute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkInit", function() { return checkInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAppState", function() { return setAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTopNavMenu", function() { return setTopNavMenu; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");

const setShowTopNav = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].CONFIG_SHOW_TOP_NAV,
    payload
  };
};
const setCurrentRoute = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].CONFIG_SET_CURRENT_ROUTE,
    payload
  };
};
const checkInit = http => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].CONFIG_REDELK_INIT_CHECK,
    http: http
  };
};
const setAppState = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].CONFIG_SET_APPSTATE,
    payload
  };
};
const setTopNavMenu = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].CONFIG_SET_TOPNAVMENU,
    payload
  };
};

/***/ }),

/***/ "./public/redux/config/configReducer.ts":
/*!**********************************************!*\
  !*** ./public/redux/config/configReducer.ts ***!
  \**********************************************/
/*! exports provided: configReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configReducer", function() { return configReducer; });
/* harmony import */ var _createReducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createReducer */ "./public/redux/createReducer.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./public/types.ts");



const initialState = {
  showTopNav: false,
  currentRoute: "",
  initStatus: _types__WEBPACK_IMPORTED_MODULE_2__["RedelkInitStatus"].idle,
  appState: _types__WEBPACK_IMPORTED_MODULE_1__["defaultAppState"],
  topNavMenu: []
};
const configReducer = Object(_createReducer__WEBPACK_IMPORTED_MODULE_0__["default"])(initialState, {
  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK](state, action) {
    return { ...state,
      initStatus: _types__WEBPACK_IMPORTED_MODULE_2__["RedelkInitStatus"].pending
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK_SUCCESS](state, action) {
    return { ...state,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["RedelkInitStatus"].success,
      initStatus: null
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK_FAILURE](state, action) {
    return { ...state,
      initStatus: _types__WEBPACK_IMPORTED_MODULE_2__["RedelkInitStatus"].failure
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_SHOW_TOP_NAV](state, action) {
    return { ...state,
      showTopNav: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_SET_CURRENT_ROUTE](state, action) {
    return { ...state,
      currentRoute: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_SET_IS_INITIALIZED](state, action) {
    return { ...state,
      isInitialized: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_SET_APPSTATE](state, action) {
    return { ...state,
      appState: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_SET_TOPNAVMENU](state, action) {
    return { ...state,
      topNavMenu: action.payload
    };
  }

});

/***/ }),

/***/ "./public/redux/config/configSaga.ts":
/*!*******************************************!*\
  !*** ./public/redux/config/configSaga.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-saga/effects */ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");



function* checkInit({
  http
}) {
  try {
    const response = yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["call"])(http.get, {
      path: '/api/redelk/init'
    });
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK_SUCCESS,
      payload: response.rawResponse
    });
  } catch (e) {
    console.error(e);
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK_FAILURE,
      payload: e
    });
  }
}

function* onCheckInitWatcher() {
  yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["takeLatest"])(_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].CONFIG_REDELK_INIT_CHECK, checkInit);
}

/* harmony default export */ __webpack_exports__["default"] = ([Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["fork"])(onCheckInitWatcher)]);

/***/ }),

/***/ "./public/redux/createReducer.ts":
/*!***************************************!*\
  !*** ./public/redux/createReducer.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createReducer; });
function createReducer(initialState, handlers) {
  const r = (state = initialState, action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };

  return r;
}

/***/ }),

/***/ "./public/redux/rootActions.ts":
/*!*************************************!*\
  !*** ./public/redux/rootActions.ts ***!
  \*************************************/
/*! exports provided: ActionCreators */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionCreators", function() { return ActionCreators; });
/* harmony import */ var _config_configActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/configActions */ "./public/redux/config/configActions.ts");
/* harmony import */ var _rtops_rtopsActions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rtops/rtopsActions */ "./public/redux/rtops/rtopsActions.ts");


const ActionCreators = Object.assign({}, { ..._config_configActions__WEBPACK_IMPORTED_MODULE_0__,
  ..._rtops_rtopsActions__WEBPACK_IMPORTED_MODULE_1__
});

/***/ }),

/***/ "./public/redux/rootReducer.ts":
/*!*************************************!*\
  !*** ./public/redux/rootReducer.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/lib/redux.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_configReducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/configReducer */ "./public/redux/config/configReducer.ts");
/* harmony import */ var _rtops_rtopsReducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rtops/rtopsReducer */ "./public/redux/rtops/rtopsReducer.ts");



const rootReducer = Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  config: _config_configReducer__WEBPACK_IMPORTED_MODULE_1__["configReducer"],
  rtops: _rtops_rtopsReducer__WEBPACK_IMPORTED_MODULE_2__["rtopsReducer"]
});
/* harmony default export */ __webpack_exports__["default"] = (rootReducer);

/***/ }),

/***/ "./public/redux/rootSaga.ts":
/*!**********************************!*\
  !*** ./public/redux/rootSaga.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return rootSaga; });
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-saga/effects */ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _rtops_rtopsSaga__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rtops/rtopsSaga */ "./public/redux/rtops/rtopsSaga.ts");
/* harmony import */ var _config_configSaga__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config/configSaga */ "./public/redux/config/configSaga.ts");



function* rootSaga() {
  yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["all"])([..._config_configSaga__WEBPACK_IMPORTED_MODULE_2__["default"], ..._rtops_rtopsSaga__WEBPACK_IMPORTED_MODULE_1__["default"]]);
}

/***/ }),

/***/ "./public/redux/rtops/rtopsActions.ts":
/*!********************************************!*\
  !*** ./public/redux/rtops/rtopsActions.ts ***!
  \********************************************/
/*! exports provided: fetchAllRtops, createIOC, setStatus, setShowAddIOCForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchAllRtops", function() { return fetchAllRtops; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIOC", function() { return createIOC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStatus", function() { return setStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setShowAddIOCForm", function() { return setShowAddIOCForm; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");

const fetchAllRtops = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].RTOPS_FETCH_ALL_REQUEST,
    payload
  };
};
const createIOC = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].RTOPS_CREATE_IOC_REQUEST,
    payload
  };
};
const setStatus = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].RTOPS_SET_STATUS,
    payload
  };
};
const setShowAddIOCForm = payload => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["ActionType"].RTOPS_SHOW_ADD_IOC_FORM,
    payload
  };
};

/***/ }),

/***/ "./public/redux/rtops/rtopsReducer.ts":
/*!********************************************!*\
  !*** ./public/redux/rtops/rtopsReducer.ts ***!
  \********************************************/
/*! exports provided: rtopsReducer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rtopsReducer", function() { return rtopsReducer; });
/* harmony import */ var _createReducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createReducer */ "./public/redux/createReducer.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./public/types.ts");



const initialState = {
  status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].idle,
  error: null,
  rtops: undefined,
  showAddIOCForm: false,
  lastRefresh: undefined
};
const rtopsReducer = Object(_createReducer__WEBPACK_IMPORTED_MODULE_0__["default"])(initialState, {
  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST](state, action) {
    return { ...state,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].pending
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST_SUCCESS](state, action) {
    return { ...state,
      rtops: action.payload,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].success,
      error: null,
      lastRefresh: new Date()
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST_FAILURE](state, action) {
    return { ...state,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].failure,
      error: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST](state, action) {
    return { ...state
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST_SUCCESS](state, action) {
    return { ...state,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].success,
      error: null
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST_FAILURE](state, action) {
    return { ...state,
      status: _types__WEBPACK_IMPORTED_MODULE_2__["KbnCallStatus"].failure,
      error: action.payload
    };
  },

  [_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_SHOW_ADD_IOC_FORM](state, action) {
    return { ...state,
      showAddIOCForm: action.payload
    };
  }

});
/* harmony default export */ __webpack_exports__["default"] = (rtopsReducer);

/***/ }),

/***/ "./public/redux/rtops/rtopsSaga.ts":
/*!*****************************************!*\
  !*** ./public/redux/rtops/rtopsSaga.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-saga/effects */ "./node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js");
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./public/redux/types.ts");



const callSearchPromise = ({
  fn,
  opts
}) => {
  return fn(opts).toPromise();
};

function* fetchAllRtops({
  payload: {
    data,
    searchOpts
  }
}) {
  try {
    const response = yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["call"])(callSearchPromise, {
      fn: data.search.search,
      opts: searchOpts
    });
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST_SUCCESS,
      payload: response.rawResponse
    });
  } catch (e) {
    console.error(e);
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST_FAILURE,
      payload: e
    });
  }
}

function* createIoc({
  payload: {
    http,
    payload
  }
}) {
  try {
    const response = yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["call"])(http.post, {
      path: '/api/redelk/ioc',
      body: JSON.stringify(payload)
    });
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST_SUCCESS,
      payload: response.rawResponse
    });
  } catch (e) {
    console.error(e);
    yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["put"])({
      type: _types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST_FAILURE,
      payload: e
    });
  }
}

function* onSetRtopsWatcher() {
  yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["takeLatest"])(_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_FETCH_ALL_REQUEST, fetchAllRtops);
}

function* onCreateIOCWatcher() {
  yield Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["takeLatest"])(_types__WEBPACK_IMPORTED_MODULE_1__["ActionType"].RTOPS_CREATE_IOC_REQUEST, createIoc);
}

/* harmony default export */ __webpack_exports__["default"] = ([Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["fork"])(onSetRtopsWatcher), Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_0__["fork"])(onCreateIOCWatcher)]);

/***/ }),

/***/ "./public/redux/selectors.ts":
/*!***********************************!*\
  !*** ./public/redux/selectors.ts ***!
  \***********************************/
/*! exports provided: getConfigState, getRtopsState, getCurrentRoute, getShowTopNav, getInitStatus, getAppState, getTopNavMenu, getRtopsEsAnswer, getRtopsHits, getRtopsAggs, getRtopsStatus, getRtopsShowAddIOCForm, getRtopsFilteredIOC, getRtopsLastRefreshDate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConfigState", function() { return getConfigState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsState", function() { return getRtopsState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentRoute", function() { return getCurrentRoute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getShowTopNav", function() { return getShowTopNav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInitStatus", function() { return getInitStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAppState", function() { return getAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTopNavMenu", function() { return getTopNavMenu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsEsAnswer", function() { return getRtopsEsAnswer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsHits", function() { return getRtopsHits; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsAggs", function() { return getRtopsAggs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsStatus", function() { return getRtopsStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsShowAddIOCForm", function() { return getRtopsShowAddIOCForm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsFilteredIOC", function() { return getRtopsFilteredIOC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRtopsLastRefreshDate", function() { return getRtopsLastRefreshDate; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reselect */ "./node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const getConfigState = state => state.config;
const getRtopsState = state => state.rtops;
const getCurrentRoute = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getConfigState], configState => configState.currentRoute);
const getShowTopNav = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getConfigState], configState => configState.showTopNav);
const getInitStatus = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getConfigState], configState => configState.initStatus);
const getAppState = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getConfigState], configState => configState.appState);
const getTopNavMenu = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getConfigState], configState => configState.topNavMenu);
const getRtopsEsAnswer = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsState], rtopsState => rtopsState.rtops);
const getRtopsHits = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsEsAnswer], rtopsEsAnswer => (rtopsEsAnswer === null || rtopsEsAnswer === void 0 ? void 0 : rtopsEsAnswer.hits.hits) || []);
const getRtopsAggs = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsEsAnswer], rtopsEsAnswer => (rtopsEsAnswer === null || rtopsEsAnswer === void 0 ? void 0 : rtopsEsAnswer.aggregations) || {});
const getRtopsStatus = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsState], rtopsState => rtopsState.status);
const getRtopsShowAddIOCForm = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsState], rtopsState => rtopsState.showAddIOCForm);
const getRtopsFilteredIOC = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsHits], rtops => Object(lodash__WEBPACK_IMPORTED_MODULE_1__["filter"])(rtops, r => {
  var _r$_source, _r$_source$c, _r$_source$c$log;

  return ((_r$_source = r._source) === null || _r$_source === void 0 ? void 0 : (_r$_source$c = _r$_source.c2) === null || _r$_source$c === void 0 ? void 0 : (_r$_source$c$log = _r$_source$c.log) === null || _r$_source$c$log === void 0 ? void 0 : _r$_source$c$log.type) === 'ioc';
}));
const getRtopsLastRefreshDate = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRtopsState], rtopsState => rtopsState.lastRefresh);

/***/ }),

/***/ "./public/redux/types.ts":
/*!*******************************!*\
  !*** ./public/redux/types.ts ***!
  \*******************************/
/*! exports provided: ActionType, defaultAppState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionType", function() { return ActionType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultAppState", function() { return defaultAppState; });
let ActionType;

(function (ActionType) {
  ActionType["CONFIG_SHOW_TOP_NAV"] = "config/CONFIG_SHOW_TOP_NAV";
  ActionType["CONFIG_SET_CURRENT_ROUTE"] = "config/CONFIG_SET_CURRENT_ROUTE";
  ActionType["CONFIG_SET_IS_INITIALIZED"] = "config/CONFIG_SET_IS_INITIALIZED";
  ActionType["CONFIG_SET_APPSTATE"] = "config/CONFIG_SET_APPSTATE";
  ActionType["CONFIG_SET_TOPNAVMENU"] = "config/CONFIG_SET_TOPNAVMENU";
  ActionType["CONFIG_REDELK_INIT_CHECK"] = "config/CONFIG_REDELK_INIT_CHECK";
  ActionType["CONFIG_REDELK_INIT_CHECK_SUCCESS"] = "config/CONFIG_REDELK_INIT_CHECK_SUCCESS";
  ActionType["CONFIG_REDELK_INIT_CHECK_FAILURE"] = "config/CONFIG_REDELK_INIT_CHECK_FAILURE";
  ActionType["RTOPS_FETCH_ALL_REQUEST"] = "rtops/RTOPS_FETCH_ALL_REQUEST";
  ActionType["RTOPS_FETCH_ALL_REQUEST_SUCCESS"] = "rtops/RTOPS_FETCH_ALL_REQUEST_SUCCESS";
  ActionType["RTOPS_FETCH_ALL_REQUEST_FAILURE"] = "rtops/RTOPS_FETCH_ALL_REQUEST_FAILURE";
  ActionType["RTOPS_CREATE_IOC_REQUEST"] = "rtops/RTOPS_CREATE_IOC_REQUEST";
  ActionType["RTOPS_CREATE_IOC_REQUEST_SUCCESS"] = "rtops/RTOPS_CREATE_IOC_REQUEST_SUCCESS";
  ActionType["RTOPS_CREATE_IOC_REQUEST_FAILURE"] = "rtops/RTOPS_CREATE_IOC_REQUEST_FAILURE";
  ActionType["RTOPS_SET_IOC"] = "rtops/RTOPS_SET_IOC";
  ActionType["RTOPS_SHOW_ADD_IOC_FORM"] = "rtops/RTOPS_SHOW_ADD_IOC_FORM";
  ActionType["RTOPS_SET_STATUS"] = "rtops/RTOPS_SET_STATUS";
})(ActionType || (ActionType = {}));

const defaultAppState = {
  name: '',
  filters: [],
  time: {
    from: 'now-1y',
    to: 'now'
  }
};
/**
 * Rtops types
 */

/***/ })

}]);
//# sourceMappingURL=1.plugin.js.map