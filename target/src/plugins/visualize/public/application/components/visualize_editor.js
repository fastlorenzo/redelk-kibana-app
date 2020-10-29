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
exports.VisualizeEditor = void 0;
const tslib_1 = require("tslib");
require("./visualize_editor.scss");
const react_1 = tslib_1.__importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const events_1 = require("events");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../kibana_react/public");
const utils_1 = require("../utils");
const experimental_vis_info_1 = require("./experimental_vis_info");
const visualize_top_nav_1 = require("./visualize_top_nav");
exports.VisualizeEditor = () => {
    const { id: visualizationIdFromUrl } = react_router_dom_1.useParams();
    const [originatingApp, setOriginatingApp] = react_1.useState();
    const { services } = public_1.useKibana();
    const [eventEmitter] = react_1.useState(new events_1.EventEmitter());
    const [hasUnsavedChanges, setHasUnsavedChanges] = react_1.useState(!visualizationIdFromUrl);
    const isChromeVisible = utils_1.useChromeVisibility(services.chrome);
    const { savedVisInstance, visEditorRef, visEditorController } = utils_1.useSavedVisInstance(services, eventEmitter, isChromeVisible, visualizationIdFromUrl);
    const { appState, hasUnappliedChanges } = utils_1.useVisualizeAppState(services, eventEmitter, savedVisInstance);
    const { isEmbeddableRendered, currentAppState } = utils_1.useEditorUpdates(services, eventEmitter, setHasUnsavedChanges, appState, savedVisInstance, visEditorController);
    utils_1.useLinkedSearchUpdates(services, eventEmitter, appState, savedVisInstance);
    react_1.useEffect(() => {
        const { originatingApp: value } = services.embeddable.getStateTransfer(services.scopedHistory).getIncomingEditorState() || {};
        setOriginatingApp(value);
    }, [services]);
    react_1.useEffect(() => {
        // clean up all registered listeners if any is left
        return () => {
            eventEmitter.removeAllListeners();
        };
    }, [eventEmitter]);
    return (react_1.default.createElement("div", { className: `app-container visEditor visEditor--${savedVisInstance?.vis.type.name}` },
        savedVisInstance && appState && currentAppState && (react_1.default.createElement(visualize_top_nav_1.VisualizeTopNav, { currentAppState: currentAppState, hasUnsavedChanges: hasUnsavedChanges, setHasUnsavedChanges: setHasUnsavedChanges, isChromeVisible: isChromeVisible, isEmbeddableRendered: isEmbeddableRendered, hasUnappliedChanges: hasUnappliedChanges, originatingApp: originatingApp, setOriginatingApp: setOriginatingApp, savedVisInstance: savedVisInstance, stateContainer: appState, visualizationIdFromUrl: visualizationIdFromUrl })),
        savedVisInstance?.vis?.type?.isExperimental && react_1.default.createElement(experimental_vis_info_1.ExperimentalVisInfo, null),
        savedVisInstance && (react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
            react_1.default.createElement("h1", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visualize.pageHeading", defaultMessage: "{chartName} {chartType} visualization", values: {
                        chartName: savedVisInstance.savedVis.title,
                        chartType: savedVisInstance.vis.type.title,
                    } })))),
        react_1.default.createElement("div", { className: isChromeVisible ? 'visEditor__content' : 'visualize', ref: visEditorRef })));
};
