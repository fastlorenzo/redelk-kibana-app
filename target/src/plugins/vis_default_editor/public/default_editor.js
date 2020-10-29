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
exports.default = void 0;
const tslib_1 = require("tslib");
require("./index.scss");
const react_1 = tslib_1.__importStar(require("react"));
const public_1 = require("../../kibana_react/public");
const public_2 = require("../../kibana_utils/public");
const sidebar_1 = require("./components/sidebar");
const editor_size_1 = require("./editor_size");
const localStorage = new public_2.Storage(window.localStorage);
function DefaultEditor({ core, data, vis, uiState, timeRange, filters, optionTabs, query, embeddableHandler, eventEmitter, linked, savedSearch, }) {
    const visRef = react_1.useRef(null);
    const [isCollapsed, setIsCollapsed] = react_1.useState(false);
    const onClickCollapse = react_1.useCallback(() => {
        setIsCollapsed((value) => !value);
    }, []);
    react_1.useEffect(() => {
        if (!visRef.current) {
            return;
        }
        embeddableHandler.render(visRef.current);
        setTimeout(() => {
            eventEmitter.emit('embeddableRendered');
        });
        return () => embeddableHandler.destroy();
    }, [embeddableHandler, eventEmitter]);
    react_1.useEffect(() => {
        embeddableHandler.updateInput({
            timeRange,
            filters,
            query,
        });
    }, [embeddableHandler, timeRange, filters, query]);
    const editorInitialWidth = editor_size_1.getInitialWidth(vis.type.editorConfig.defaultSize);
    return (react_1.default.createElement(core.i18n.Context, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: {
                appName: 'vis_default_editor',
                storage: localStorage,
                data,
                ...core,
            } },
            react_1.default.createElement(public_1.PanelsContainer, { className: "visEditor--default", resizerClassName: `visEditor__resizer ${isCollapsed ? 'visEditor__resizer-isHidden' : ''}` },
                react_1.default.createElement(public_1.Panel, { className: "visEditor__visualization", initialWidth: 100 - editorInitialWidth },
                    react_1.default.createElement("div", { className: "visEditor__canvas", ref: visRef, "data-shared-items-container": true })),
                react_1.default.createElement(public_1.Panel, { className: `visEditor__collapsibleSidebar ${isCollapsed ? 'visEditor__collapsibleSidebar-isClosed' : ''}`, initialWidth: editorInitialWidth },
                    react_1.default.createElement(sidebar_1.DefaultEditorSideBar, { embeddableHandler: embeddableHandler, isCollapsed: isCollapsed, onClickCollapse: onClickCollapse, optionTabs: optionTabs, vis: vis, uiState: uiState, isLinkedSearch: linked, savedSearch: savedSearch, timeRange: timeRange, eventEmitter: eventEmitter }))))));
}
exports.default = DefaultEditor;
