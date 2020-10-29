"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewer = void 0;
const tslib_1 = require("tslib");
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
require("./doc_viewer.scss");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const kibana_services_1 = require("../../../kibana_services");
const doc_viewer_tab_1 = require("./doc_viewer_tab");
/**
 * Rendering tabs with different views of 1 Elasticsearch hit in Discover.
 * The tabs are provided by the `docs_views` registry.
 * A view can contain a React `component`, or any JS framework by using
 * a `render` function.
 */
function DocViewer(renderProps) {
    const docViewsRegistry = kibana_services_1.getDocViewsRegistry();
    const tabs = docViewsRegistry
        .getDocViewsSorted(renderProps.hit)
        .map(({ title, render, component }, idx) => {
        return {
            id: `kbn_doc_viewer_tab_${idx}`,
            name: title,
            content: (react_1.default.createElement(doc_viewer_tab_1.DocViewerTab, { id: idx, title: title, component: component, renderProps: renderProps, render: render })),
        };
    });
    if (!tabs.length) {
        // There there's a minimum of 2 tabs active in Discover.
        // This condition takes care of unit tests with 0 tabs.
        return null;
    }
    return (react_1.default.createElement("div", { className: "kbnDocViewer" },
        react_1.default.createElement(eui_1.EuiTabbedContent, { tabs: tabs })));
}
exports.DocViewer = DocViewer;
