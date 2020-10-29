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
exports.VisualizationChart = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const public_1 = require("../../../../plugins/kibana_utils/public");
class VisualizationChart extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.chartDiv = react_1.default.createRef();
        this.containerDiv = react_1.default.createRef();
        this.onUiStateChanged = () => {
            this.startRenderVisualization();
        };
        this.renderSubject = new Rx.Subject();
        const render$ = this.renderSubject.asObservable().pipe(operators_1.share());
        const success$ = render$.pipe(operators_1.filter(({ vis, visData }) => vis && (!vis.type.requiresSearch || visData)), operators_1.debounceTime(100), operators_1.switchMap(async ({ vis, visData, visParams }) => {
            if (!this.visualization) {
                // This should never happen, since we only should trigger another rendering
                // after this component has mounted and thus the visualization implementation
                // has been initialized
                throw new Error('Visualization implementation was not initialized on first render.');
            }
            return this.visualization.render(visData, visParams);
        }));
        this.renderSubscription = success$.subscribe(() => {
            if (this.props.onInit) {
                this.props.onInit();
            }
        });
    }
    render() {
        return (react_1.default.createElement("div", { className: "visChart__container kbn-resetFocusState", tabIndex: 0, ref: this.containerDiv },
            react_1.default.createElement("div", { className: "visChart", ref: this.chartDiv })));
    }
    componentDidMount() {
        if (!this.chartDiv.current || !this.containerDiv.current) {
            throw new Error('chartDiv and currentDiv reference should always be present.');
        }
        const { vis } = this.props;
        const Visualization = vis.type.visualization;
        this.visualization = new Visualization(this.chartDiv.current, vis);
        // We know that containerDiv.current will never be null, since we will always
        // have rendered and the div is always rendered into the tree (i.e. not
        // inside any condition).
        this.resizeChecker = new public_1.ResizeChecker(this.containerDiv.current);
        this.resizeChecker.on('resize', () => this.startRenderVisualization());
        if (this.props.listenOnChange) {
            this.props.uiState.on('change', this.onUiStateChanged);
        }
        this.startRenderVisualization();
    }
    componentDidUpdate() {
        this.startRenderVisualization();
    }
    componentWillUnmount() {
        if (this.renderSubscription) {
            this.renderSubscription.unsubscribe();
        }
        if (this.resizeChecker) {
            this.resizeChecker.destroy();
        }
        if (this.visualization) {
            this.visualization.destroy();
        }
    }
    startRenderVisualization() {
        if (this.containerDiv.current && this.chartDiv.current) {
            this.renderSubject.next({
                vis: this.props.vis,
                visData: this.props.visData,
                visParams: this.props.visParams,
            });
        }
    }
}
exports.VisualizationChart = VisualizationChart;
