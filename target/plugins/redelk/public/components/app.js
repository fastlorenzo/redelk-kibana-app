"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedelkApp = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
//import {BrowserRouter as Router} from 'react-router-dom';
const react_router_dom_1 = require("react-router-dom");
const iocPage_1 = require("./iocPage");
const summaryPage_1 = require("./summaryPage");
const eui_1 = require("@elastic/eui");
const navHeaderHelper_1 = require("../navHeaderHelper");
const react_redux_1 = require("react-redux");
const common_1 = require("../../common");
const public_1 = require("../../../../src/plugins/data/public");
const public_2 = require("../../../../src/plugins/kibana_utils/public");
const iocSlice_1 = tslib_1.__importDefault(require("../features/ioc/iocSlice"));
const defaultAppState = {
    name: '',
    filters: [],
    time: {
        from: 'now-1y',
        to: 'now'
    }
};
const { Provider: AppStateContainerProvider, useState: useAppState, useContainer: useAppStateContainer, } = public_2.createStateContainerReactHelpers();
const useIndexPattern = (data) => {
    const [indexPattern, setIndexPattern] = react_1.useState();
    react_1.useEffect(() => {
        const fetchIndexPattern = async () => {
            const defaultIndexPattern = await data.indexPatterns.getDefault();
            if (defaultIndexPattern) {
                setIndexPattern(defaultIndexPattern);
            }
        };
        fetchIndexPattern();
    }, [data.indexPatterns]);
    return indexPattern;
};
const useCreateStateContainer = (defaultState) => {
    const stateContainerRef = react_1.useRef(null);
    if (!stateContainerRef.current) {
        stateContainerRef.current = public_2.createStateContainer(defaultState);
    }
    return stateContainerRef.current;
};
const useGlobalStateSyncing = (query, kbnUrlStateStorage) => {
    // setup sync state utils
    react_1.useEffect(() => {
        // sync global filters, time filters, refresh interval from data.query to url '_g'
        const { stop } = public_1.syncQueryStateWithUrl(query, kbnUrlStateStorage);
        return () => {
            stop();
        };
    }, [query, kbnUrlStateStorage]);
};
const useAppStateSyncing = (appStateContainer, query, kbnUrlStateStorage) => {
    // setup sync state utils
    react_1.useEffect(() => {
        // sync app filters with app state container from data.query to state container
        const stopSyncingQueryAppStateWithStateContainer = public_1.connectToQueryState(query, appStateContainer, { filters: public_1.esFilters.FilterStateStore.APP_STATE, time: true });
        // sets up syncing app state container with url
        const { start: startSyncingAppStateWithUrl, stop: stopSyncingAppStateWithUrl } = public_2.syncState({
            storageKey: '_a',
            stateStorage: kbnUrlStateStorage,
            stateContainer: {
                ...appStateContainer,
                // stateSync utils requires explicit handling of default state ("null")
                set: (state) => state && appStateContainer.set(state),
            },
        });
        // merge initial state from app state container and current state in url
        const initialAppState = {
            ...appStateContainer.get(),
            ...kbnUrlStateStorage.get('_a'),
        };
        // trigger state update. actually needed in case some data was in url
        appStateContainer.set(initialAppState);
        // set current url to whatever is in app state container
        kbnUrlStateStorage.set('_a', initialAppState);
        // finally start syncing state containers with url
        startSyncingAppStateWithUrl();
        return () => {
            stopSyncingQueryAppStateWithStateContainer();
            stopSyncingAppStateWithUrl();
        };
    }, [query, kbnUrlStateStorage, appStateContainer]);
};
const tabs = [
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
const RedelkAppInternal = ({ basename, navigation, data, core, history, kbnUrlStateStorage }) => {
    const { notifications, http } = core;
    const appStateContainer = useAppStateContainer();
    const appState = useAppState();
    const [selectedTabId, setSelectedTabId] = react_1.useState(DEFAULT_TAB);
    const [brdcrmbs, setBrdcrmbs] = react_1.useState([{ text: tabs.find(t => t.id === DEFAULT_TAB).name }]);
    const [isAddIOCFlyoutVisible, setIsAddIOCFlyoutVisible] = react_1.useState(false);
    const [showTopNav, setShowTopNav] = react_1.useState(false);
    useGlobalStateSyncing(data.query, kbnUrlStateStorage);
    useAppStateSyncing(appStateContainer, data.query, kbnUrlStateStorage);
    let breadcrumbs = [];
    breadcrumbs.push({
        href: core.application.getUrlForApp(common_1.PLUGIN_ID),
        onClick: (e) => {
            core.application.navigateToApp(common_1.PLUGIN_ID, { path: '/' });
            e.preventDefault();
        },
        text: common_1.PLUGIN_NAME
    });
    breadcrumbs = breadcrumbs.concat(brdcrmbs);
    react_1.useEffect(() => {
        navHeaderHelper_1.setNavHeader(core, breadcrumbs);
    }, [breadcrumbs]);
    const onSelectedTabChanged = (id) => {
        setSelectedTabId(id);
        setBrdcrmbs([{ text: tabs.find(t => t.id === id).name }]);
    };
    const renderTabs = () => {
        return tabs.map((tab, index) => (react_1.default.createElement(eui_1.EuiTab, { onClick: () => onSelectedTabChanged(tab.id), isSelected: tab.id === selectedTabId, disabled: tab.disabled, key: index }, tab.name)));
    };
    let displayTab = (react_1.default.createElement(react_1.default.Fragment, null));
    const onQuerySubmit = react_1.useCallback(({ query }) => {
        appStateContainer.set({ ...appState, query });
    }, [appStateContainer, appState]);
    const dispatch = react_redux_1.useDispatch();
    react_1.useEffect(() => {
        let tmpFilters = [...appState.filters];
        if (appState.time !== undefined) {
            const trFilter = public_1.getTime(indexPattern, appState.time);
            if (trFilter !== undefined) {
                tmpFilters.push(trFilter);
            }
        }
        const iocFilter = {
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
        };
        tmpFilters.push(iocFilter);
        const esQueryFilters = public_1.esQuery.buildQueryFromFilters(tmpFilters, indexPattern);
        let searchOpts = {
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
            };
        }
        data.search.search(searchOpts).forEach((res) => {
            dispatch(iocSlice_1.default.actions.setIOC(res.rawResponse));
        });
    }, [appState]);
    const indexPattern = useIndexPattern(data);
    if (!indexPattern)
        return react_1.default.createElement("div", null, "No index pattern found. Please create an index patter before loading...");
    let navConfig = [];
    switch (selectedTabId) {
        case "ioc":
            displayTab = (react_1.default.createElement(iocPage_1.IOCPage, { basename: basename, notifications: notifications, http: http, navigation: navigation, data: data, showAddIOCFlyout: isAddIOCFlyoutVisible, setIOCFlyoutVisible: setIsAddIOCFlyoutVisible, showTopNav: setShowTopNav }));
            navConfig.push({
                id: "add-ioc",
                label: "Add IOC",
                run: () => {
                    setIsAddIOCFlyoutVisible(true);
                }
            });
            break;
        case "summary":
        default:
            displayTab = (react_1.default.createElement(summaryPage_1.SummaryPage, { basename: basename, notifications: notifications, http: http, navigation: navigation, showTopNav: setShowTopNav }));
            break;
    }
    const topNav = showTopNav ? (react_1.default.createElement(navigation.ui.TopNavMenu, { appName: common_1.PLUGIN_ID, showSearchBar: true, indexPatterns: [indexPattern], useDefaultBehaviors: true, onQuerySubmit: onQuerySubmit, query: appState.query, showSaveQuery: true, config: navConfig })) : '';
    return (react_1.default.createElement(react_router_dom_1.Router, { history: history },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiTabs, { size: "s", expand: true }, renderTabs()),
            topNav,
            displayTab)));
};
exports.RedelkApp = (props) => {
    const appStateContainer = useCreateStateContainer(defaultAppState);
    return (react_1.default.createElement(AppStateContainerProvider, { value: appStateContainer },
        react_1.default.createElement(RedelkAppInternal, Object.assign({}, props))));
};
