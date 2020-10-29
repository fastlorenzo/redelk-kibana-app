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
exports.visualization = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
// @ts-ignore
const vis_1 = require("./vis");
const components_1 = require("../components");
exports.visualization = () => ({
    name: 'visualization',
    displayName: 'visualization',
    reuseDomNode: true,
    render: async (domNode, config, handlers) => {
        const { visData, visConfig, params } = config;
        const visType = config.visType || visConfig.type;
        const vis = new vis_1.ExprVis({
            title: config.title,
            type: visType,
            params: visConfig,
        });
        vis.eventsSubject = { next: handlers.event };
        const uiState = handlers.uiState || vis.getUiState();
        handlers.onDestroy(() => {
            react_dom_1.unmountComponentAtNode(domNode);
        });
        const listenOnChange = params ? params.listenOnChange : false;
        react_dom_1.render(react_1.default.createElement(components_1.Visualization, { vis: vis, visData: visData, visParams: vis.params, uiState: uiState, listenOnChange: listenOnChange, onInit: handlers.done }), domNode);
    },
});
