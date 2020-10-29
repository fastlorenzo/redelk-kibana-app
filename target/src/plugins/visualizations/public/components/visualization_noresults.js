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
exports.VisualizationNoResults = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
class VisualizationNoResults extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.containerDiv = react_1.default.createRef();
    }
    render() {
        return (react_1.default.createElement("div", { className: "visError", ref: this.containerDiv },
            react_1.default.createElement("div", { className: "item top" }),
            react_1.default.createElement("div", { className: "item" },
                react_1.default.createElement(eui_1.EuiText, { size: "xs", color: "subdued" },
                    react_1.default.createElement(eui_1.EuiIcon, { type: "visualizeApp", size: "m", color: "subdued" }),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                    react_1.default.createElement("p", null, "No results found"))),
            react_1.default.createElement("div", { className: "item bottom" })));
    }
    componentDidMount() {
        this.afterRender();
    }
    componentDidUpdate() {
        this.afterRender();
    }
    afterRender() {
        if (this.props.onInit) {
            this.props.onInit();
        }
    }
}
exports.VisualizationNoResults = VisualizationNoResults;
