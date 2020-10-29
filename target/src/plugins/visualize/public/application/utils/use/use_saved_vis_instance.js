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
exports.useSavedVisInstance = void 0;
const react_1 = require("react");
const query_string_1 = require("query-string");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../kibana_utils/public");
const public_2 = require("../../../../../vis_default_editor/public");
const get_visualization_instance_1 = require("../get_visualization_instance");
const breadcrumbs_1 = require("../breadcrumbs");
const visualize_constants_1 = require("../../visualize_constants");
/**
 * This effect is responsible for instantiating a saved vis or creating a new one
 * using url parameters, embedding and destroying it in DOM
 */
exports.useSavedVisInstance = (services, eventEmitter, isChromeVisible, visualizationIdFromUrl) => {
    const [state, setState] = react_1.useState({});
    const visEditorRef = react_1.useRef(null);
    const visId = react_1.useRef('');
    react_1.useEffect(() => {
        const { application: { navigateToApp }, chrome, history, http: { basePath }, setActiveUrl, toastNotifications, } = services;
        const getSavedVisInstance = async () => {
            try {
                let savedVisInstance;
                if (history.location.pathname === '/create') {
                    const searchParams = query_string_1.parse(history.location.search);
                    const visTypes = services.visualizations.all();
                    const visType = visTypes.find(({ name }) => name === searchParams.type);
                    if (!visType) {
                        throw new Error(i18n_1.i18n.translate('visualize.createVisualization.noVisTypeErrorMessage', {
                            defaultMessage: 'You must provide a valid visualization type',
                        }));
                    }
                    const shouldHaveIndex = visType.requiresSearch && visType.options.showIndexSelection;
                    const hasIndex = searchParams.indexPattern || searchParams.savedSearchId;
                    if (shouldHaveIndex && !hasIndex) {
                        throw new Error(i18n_1.i18n.translate('visualize.createVisualization.noIndexPatternOrSavedSearchIdErrorMessage', {
                            defaultMessage: 'You must provide either an indexPattern or a savedSearchId',
                        }));
                    }
                    savedVisInstance = await get_visualization_instance_1.getVisualizationInstance(services, searchParams);
                }
                else {
                    savedVisInstance = await get_visualization_instance_1.getVisualizationInstance(services, visualizationIdFromUrl);
                }
                const { embeddableHandler, savedVis, vis } = savedVisInstance;
                if (savedVis.id) {
                    chrome.setBreadcrumbs(breadcrumbs_1.getEditBreadcrumbs(savedVis.title));
                    chrome.docTitle.change(savedVis.title);
                }
                else {
                    chrome.setBreadcrumbs(breadcrumbs_1.getCreateBreadcrumbs());
                }
                let visEditorController;
                // do not create editor in embeded mode
                if (isChromeVisible) {
                    const Editor = vis.type.editor || public_2.DefaultEditorController;
                    visEditorController = new Editor(visEditorRef.current, vis, eventEmitter, embeddableHandler);
                }
                else if (visEditorRef.current) {
                    embeddableHandler.render(visEditorRef.current);
                }
                setState({
                    savedVisInstance,
                    visEditorController,
                });
            }
            catch (error) {
                const managementRedirectTarget = {
                    app: 'management',
                    path: `kibana/objects/savedVisualizations/${visualizationIdFromUrl}`,
                };
                try {
                    public_1.redirectWhenMissing({
                        history,
                        navigateToApp,
                        toastNotifications,
                        basePath,
                        mapping: {
                            visualization: visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH,
                            search: managementRedirectTarget,
                            'index-pattern': managementRedirectTarget,
                            'index-pattern-field': managementRedirectTarget,
                        },
                        onBeforeRedirect() {
                            setActiveUrl(visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH);
                        },
                    })(error);
                }
                catch (e) {
                    toastNotifications.addWarning({
                        title: i18n_1.i18n.translate('visualize.createVisualization.failedToLoadErrorMessage', {
                            defaultMessage: 'Failed to load the visualization',
                        }),
                        text: e.message,
                    });
                    history.replace(visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH);
                }
            }
        };
        if (isChromeVisible === undefined) {
            // wait for specifying chrome
            return;
        }
        if (!visId.current) {
            visId.current = visualizationIdFromUrl || 'new';
            getSavedVisInstance();
        }
        else if (visualizationIdFromUrl &&
            visId.current !== visualizationIdFromUrl &&
            state.savedVisInstance?.savedVis.id !== visualizationIdFromUrl) {
            visId.current = visualizationIdFromUrl;
            setState({});
            getSavedVisInstance();
        }
    }, [
        eventEmitter,
        isChromeVisible,
        services,
        state.savedVisInstance,
        state.visEditorController,
        visualizationIdFromUrl,
    ]);
    react_1.useEffect(() => {
        return () => {
            if (state.visEditorController) {
                state.visEditorController.destroy();
            }
            else if (state.savedVisInstance?.embeddableHandler) {
                state.savedVisInstance.embeddableHandler.destroy();
            }
            if (state.savedVisInstance?.savedVis) {
                state.savedVisInstance.savedVis.destroy();
            }
        };
    }, [state]);
    return {
        ...state,
        visEditorRef,
    };
};
