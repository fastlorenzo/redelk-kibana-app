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
exports.Visualization = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const memoize_1 = require("../legacy/memoize");
const visualization_chart_1 = require("./visualization_chart");
const visualization_noresults_1 = require("./visualization_noresults");
function shouldShowNoResultsMessage(vis, visData) {
    const requiresSearch = lodash_1.get(vis, 'type.requiresSearch');
    const rows = lodash_1.get(visData, 'rows');
    const isZeroHits = lodash_1.get(visData, 'hits') === 0 || (rows && !rows.length);
    const shouldShowMessage = !lodash_1.get(vis, 'type.useCustomNoDataScreen');
    return Boolean(requiresSearch && isZeroHits && shouldShowMessage);
}
class Visualization extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.showNoResultsMessage = memoize_1.memoizeLast(shouldShowNoResultsMessage);
        props.vis.setUiState(props.uiState);
    }
    render() {
        const { vis, visData, visParams, onInit, uiState, listenOnChange } = this.props;
        const noResults = this.showNoResultsMessage(vis, visData);
        return (react_1.default.createElement("div", { className: "visualization" }, noResults ? (react_1.default.createElement(visualization_noresults_1.VisualizationNoResults, { onInit: onInit })) : (react_1.default.createElement(visualization_chart_1.VisualizationChart, { vis: vis, visData: visData, visParams: visParams, onInit: onInit, uiState: uiState, listenOnChange: listenOnChange }))));
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.uiState !== this.props.uiState) {
            throw new Error('Changing uiState on <Visualization/> is not supported!');
        }
        return true;
    }
}
exports.Visualization = Visualization;
