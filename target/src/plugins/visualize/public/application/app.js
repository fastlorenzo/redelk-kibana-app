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
exports.VisualizeApp = void 0;
const tslib_1 = require("tslib");
require("./app.scss");
const react_1 = tslib_1.__importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const public_1 = require("../../../data/public");
const public_2 = require("../../../kibana_react/public");
const components_1 = require("./components");
const visualize_constants_1 = require("./visualize_constants");
exports.VisualizeApp = () => {
    const { services: { data: { query }, kbnUrlStateStorage, }, } = public_2.useKibana();
    const { pathname } = react_router_dom_1.useLocation();
    react_1.useEffect(() => {
        // syncs `_g` portion of url with query services
        const { stop } = public_1.syncQueryStateWithUrl(query, kbnUrlStateStorage);
        return () => stop();
        // this effect should re-run when pathname is changed to preserve querystring part,
        // so the global state is always preserved
    }, [query, kbnUrlStateStorage, pathname]);
    return (react_1.default.createElement(react_router_dom_1.Switch, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: [visualize_constants_1.VisualizeConstants.CREATE_PATH, `${visualize_constants_1.VisualizeConstants.EDIT_PATH}/:id`] },
            react_1.default.createElement(components_1.VisualizeEditor, null)),
        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: [visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH, visualize_constants_1.VisualizeConstants.WIZARD_STEP_1_PAGE_PATH] },
            react_1.default.createElement(components_1.VisualizeListing, null)),
        react_1.default.createElement(components_1.VisualizeNoMatch, null)));
};
