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
exports.InspectorPanel = void 0;
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
const inspector_view_chooser_1 = require("./inspector_view_chooser");
function hasAdaptersChanged(oldAdapters, newAdapters) {
    return (Object.keys(oldAdapters).length !== Object.keys(newAdapters).length ||
        Object.keys(oldAdapters).some((key) => oldAdapters[key] !== newAdapters[key]));
}
const inspectorTitle = i18n_1.i18n.translate('inspector.title', {
    defaultMessage: 'Inspector',
});
class InspectorPanel extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            selectedView: this.props.views[0],
            views: this.props.views,
            // Clone adapters array so we can validate that this prop never change
            adapters: { ...this.props.adapters },
        };
        this.onViewSelected = (view) => {
            if (view !== this.state.selectedView) {
                this.setState({
                    selectedView: view,
                });
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (hasAdaptersChanged(prevState.adapters, nextProps.adapters)) {
            throw new Error('Adapters are not allowed to be changed on an open InspectorPanel.');
        }
        const selectedViewMustChange = nextProps.views !== prevState.views && !nextProps.views.includes(prevState.selectedView);
        return {
            views: nextProps.views,
            selectedView: selectedViewMustChange ? nextProps.views[0] : prevState.selectedView,
        };
    }
    renderSelectedPanel() {
        return (react_1.default.createElement(this.state.selectedView.component, { adapters: this.props.adapters, title: this.props.title || '' }));
    }
    render() {
        const { views, title } = this.props;
        const { selectedView } = this.state;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                        react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_1.default.createElement("h1", null, title))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(inspector_view_chooser_1.InspectorViewChooser, { views: views, onViewSelected: this.onViewSelected, selectedView: selectedView })))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null, this.renderSelectedPanel())));
    }
}
exports.InspectorPanel = InspectorPanel;
InspectorPanel.defaultProps = {
    title: inspectorTitle,
};
InspectorPanel.propTypes = {
    adapters: prop_types_1.default.object.isRequired,
    views: (props, propName, componentName) => {
        if (!Array.isArray(props.views) || props.views.length < 1) {
            throw new Error(`${propName} prop must be an array of at least one element in ${componentName}.`);
        }
    },
    title: prop_types_1.default.string,
};
