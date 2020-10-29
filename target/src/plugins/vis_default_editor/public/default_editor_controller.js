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
exports.DefaultEditorController = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = require("react-dom");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const sidebar_1 = require("./components/sidebar");
const DefaultEditor = react_1.lazy(() => Promise.resolve().then(() => tslib_1.__importStar(require('./default_editor'))));
class DefaultEditorController {
    constructor(el, vis, eventEmitter, embeddableHandler) {
        this.el = el;
        const { type: visType } = vis;
        const optionTabs = [
            ...(visType.schemas.buckets || visType.schemas.metrics
                ? [
                    {
                        name: 'data',
                        title: i18n_1.i18n.translate('visDefaultEditor.sidebar.tabs.dataLabel', {
                            defaultMessage: 'Data',
                        }),
                        editor: sidebar_1.DefaultEditorDataTab,
                    },
                ]
                : []),
            ...(!visType.editorConfig.optionTabs && visType.editorConfig.optionsTemplate
                ? [
                    {
                        name: 'options',
                        title: i18n_1.i18n.translate('visDefaultEditor.sidebar.tabs.optionsLabel', {
                            defaultMessage: 'Options',
                        }),
                        editor: visType.editorConfig.optionsTemplate,
                    },
                ]
                : visType.editorConfig.optionTabs),
        ];
        this.state = {
            vis,
            optionTabs,
            eventEmitter,
            embeddableHandler,
        };
    }
    render(props) {
        react_dom_1.render(react_1.default.createElement(eui_1.EuiErrorBoundary, null,
            react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement("div", { style: {
                        display: 'flex',
                        flex: '1 1 auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                    } },
                    react_1.default.createElement(eui_1.EuiLoadingChart, { size: "xl", mono: true })) },
                react_1.default.createElement(DefaultEditor, Object.assign({}, this.state, props)))), this.el);
    }
    destroy() {
        react_dom_1.unmountComponentAtNode(this.el);
    }
}
exports.DefaultEditorController = DefaultEditorController;
