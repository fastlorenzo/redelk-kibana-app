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
exports.VisualizeTopNav = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const public_1 = require("../../../../kibana_react/public");
const visualize_constants_1 = require("../visualize_constants");
const utils_1 = require("../utils");
const TopNav = ({ currentAppState, isChromeVisible, isEmbeddableRendered, hasUnsavedChanges, setHasUnsavedChanges, hasUnappliedChanges, originatingApp, setOriginatingApp, savedVisInstance, stateContainer, visualizationIdFromUrl, }) => {
    const { services } = public_1.useKibana();
    const { TopNavMenu } = services.navigation.ui;
    const { embeddableHandler, vis } = savedVisInstance;
    const [inspectorSession, setInspectorSession] = react_1.useState();
    const openInspector = react_1.useCallback(() => {
        const session = embeddableHandler.openInspector();
        setInspectorSession(session);
    }, [embeddableHandler]);
    const updateQuery = react_1.useCallback(({ query }) => {
        if (!lodash_1.isEqual(currentAppState.query, query)) {
            stateContainer.transitions.set('query', query || currentAppState.query);
        }
        else {
            savedVisInstance.embeddableHandler.reload();
        }
    }, [currentAppState.query, savedVisInstance.embeddableHandler, stateContainer.transitions]);
    const config = react_1.useMemo(() => {
        if (isEmbeddableRendered) {
            return utils_1.getTopNavConfig({
                hasUnsavedChanges,
                setHasUnsavedChanges,
                hasUnappliedChanges,
                openInspector,
                originatingApp,
                setOriginatingApp,
                savedVisInstance,
                stateContainer,
                visualizationIdFromUrl,
            }, services);
        }
    }, [
        isEmbeddableRendered,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        hasUnappliedChanges,
        openInspector,
        originatingApp,
        setOriginatingApp,
        savedVisInstance,
        stateContainer,
        visualizationIdFromUrl,
        services,
    ]);
    const [indexPattern, setIndexPattern] = react_1.useState(vis.data.indexPattern);
    const showDatePicker = () => {
        // tsvb loads without an indexPattern initially (TODO investigate).
        // hide timefilter only if timeFieldName is explicitly undefined.
        const hasTimeField = vis.data.indexPattern ? !!vis.data.indexPattern.timeFieldName : true;
        return vis.type.options.showTimePicker && hasTimeField;
    };
    const showFilterBar = vis.type.options.showFilterBar;
    const showQueryInput = vis.type.requiresSearch && vis.type.options.showQueryBar;
    react_1.useEffect(() => {
        return () => {
            if (inspectorSession) {
                // Close the inspector if this scope is destroyed (e.g. because the user navigates away).
                inspectorSession.close();
            }
        };
    }, [inspectorSession]);
    react_1.useEffect(() => {
        if (!vis.data.indexPattern) {
            services.data.indexPatterns.getDefault().then((index) => {
                if (index) {
                    setIndexPattern(index);
                }
            });
        }
    }, [services.data.indexPatterns, vis.data.indexPattern]);
    return isChromeVisible ? (
    /**
     * Most visualizations have all search bar components enabled.
     * Some visualizations have fewer options, but all visualizations have the search bar.
     * That's is why the showSearchBar prop is set.
     * All visualizations also have the timepicker\autorefresh component,
     * it is enabled by default in the TopNavMenu component.
     */
    react_1.default.createElement(TopNavMenu, { appName: visualize_constants_1.APP_NAME, config: config, query: currentAppState.query, onQuerySubmit: updateQuery, savedQueryId: currentAppState.savedQuery, onSavedQueryIdChange: stateContainer.transitions.updateSavedQuery, indexPatterns: indexPattern ? [indexPattern] : undefined, screenTitle: vis.title, showAutoRefreshOnly: !showDatePicker(), showDatePicker: showDatePicker(), showFilterBar: showFilterBar, showQueryInput: showQueryInput, showSaveQuery: services.visualizeCapabilities.saveQuery, showSearchBar: true, useDefaultBehaviors: true })) : showFilterBar ? (
    /**
     * The top nav is hidden in embed mode, but the filter bar must still be present so
     * we show the filter bar on its own here if the chrome is not visible.
     */
    react_1.default.createElement(TopNavMenu, { appName: visualize_constants_1.APP_NAME, indexPatterns: indexPattern ? [indexPattern] : undefined, showSearchBar: true, showSaveQuery: false, showDatePicker: false, showQueryInput: false })) : null;
};
exports.VisualizeTopNav = react_1.memo(TopNav);
