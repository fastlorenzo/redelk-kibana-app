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
exports.DefaultEditorSideBar = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const navbar_1 = require("./navbar");
const controls_1 = require("./controls");
const state_1 = require("./state");
const sidebar_title_1 = require("./sidebar_title");
function DefaultEditorSideBar({ embeddableHandler, isCollapsed, onClickCollapse, optionTabs, uiState, vis, isLinkedSearch, eventEmitter, savedSearch, timeRange, }) {
    const [selectedTab, setSelectedTab] = react_1.useState(optionTabs[0].name);
    const [isDirty, setDirty] = react_1.useState(false);
    const [state, dispatch] = state_1.useEditorReducer(vis, eventEmitter);
    const { formState, setTouched, setValidity, resetValidity } = state_1.useEditorFormState();
    const responseAggs = react_1.useMemo(() => (state.data.aggs ? state.data.aggs.getResponseAggs() : []), [
        state.data.aggs,
    ]);
    const metricSchemas = (vis.type.schemas.metrics || []).map((s) => s.name);
    const metricAggs = react_1.useMemo(() => responseAggs.filter((agg) => metricSchemas.includes(lodash_1.get(agg, 'schema'))), [responseAggs, metricSchemas]);
    const hasHistogramAgg = react_1.useMemo(() => responseAggs.some((agg) => agg.type.name === 'histogram'), [
        responseAggs,
    ]);
    const setStateValidity = react_1.useCallback((value) => {
        setValidity('visOptions', value);
    }, [setValidity]);
    const setStateValue = react_1.useCallback((paramName, value) => {
        const shouldUpdate = !lodash_1.isEqual(state.params[paramName], value);
        if (shouldUpdate) {
            dispatch(state_1.setStateParamValue(paramName, value));
        }
    }, [dispatch, state.params]);
    const applyChanges = react_1.useCallback(() => {
        if (formState.invalid || !isDirty) {
            setTouched(true);
            return;
        }
        vis.setState({
            ...vis.serialize(),
            params: state.params,
            data: {
                aggs: state.data.aggs ? state.data.aggs.aggs.map((agg) => agg.toJSON()) : [],
            },
        });
        embeddableHandler.reload();
        eventEmitter.emit('dirtyStateChange', {
            isDirty: false,
        });
        setTouched(false);
    }, [vis, state, formState.invalid, setTouched, isDirty, eventEmitter, embeddableHandler]);
    const onSubmit = react_1.useCallback((event) => {
        if (event.ctrlKey && event.key === eui_1.keys.ENTER) {
            event.preventDefault();
            event.stopPropagation();
            applyChanges();
        }
    }, [applyChanges]);
    react_1.useEffect(() => {
        const changeHandler = ({ isDirty: dirty }) => {
            setDirty(dirty);
            if (!dirty) {
                resetValidity();
            }
        };
        eventEmitter.on('dirtyStateChange', changeHandler);
        return () => {
            eventEmitter.off('dirtyStateChange', changeHandler);
        };
    }, [resetValidity, eventEmitter]);
    // subscribe on external vis changes using browser history, for example press back button
    react_1.useEffect(() => {
        const resetHandler = () => dispatch(state_1.discardChanges(vis));
        eventEmitter.on('updateEditor', resetHandler);
        return () => {
            eventEmitter.off('updateEditor', resetHandler);
        };
    }, [dispatch, vis, eventEmitter]);
    const dataTabProps = {
        dispatch,
        formIsTouched: formState.touched,
        metricAggs,
        state,
        schemas: vis.type.schemas,
        setValidity,
        setTouched,
        setStateValue,
    };
    const optionTabProps = {
        aggs: state.data.aggs,
        hasHistogramAgg,
        stateParams: state.params,
        vis,
        uiState,
        setValue: setStateValue,
        setValidity: setStateValidity,
        setTouched,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, { className: "visEditorSidebar", direction: "column", justifyContent: "spaceBetween", gutterSize: "none", responsive: false },
            react_1.default.createElement(eui_1.EuiFlexItem, { className: "visEditorSidebar__formWrapper" },
                react_1.default.createElement("form", { className: "visEditorSidebar__form", name: "visualizeEditor", onKeyDownCapture: onSubmit },
                    vis.type.requiresSearch && (react_1.default.createElement(sidebar_title_1.SidebarTitle, { isLinkedSearch: isLinkedSearch, savedSearch: savedSearch, vis: vis, eventEmitter: eventEmitter })),
                    optionTabs.length > 1 && (react_1.default.createElement(navbar_1.DefaultEditorNavBar, { optionTabs: optionTabs, selectedTab: selectedTab, setSelectedTab: setSelectedTab })),
                    optionTabs.map(({ editor: Editor, name }) => {
                        const isTabSelected = selectedTab === name;
                        return (react_1.default.createElement("div", { key: name, className: `visEditorSidebar__config ${isTabSelected ? '' : 'visEditorSidebar__config-isHidden'}` },
                            react_1.default.createElement(Editor, Object.assign({ isTabSelected: isTabSelected }, (name === 'data' ? dataTabProps : optionTabProps), { timeRange: timeRange }))));
                    }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(controls_1.DefaultEditorControls, { applyChanges: applyChanges, dispatch: dispatch, isDirty: isDirty, isTouched: formState.touched, isInvalid: formState.invalid, vis: vis }))),
        react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-expanded": !isCollapsed, "aria-label": i18n_1.i18n.translate('visDefaultEditor.sidebar.collapseButtonAriaLabel', {
                defaultMessage: 'Toggle sidebar',
            }), className: "visEditor__collapsibleSidebarButton", "data-test-subj": "collapseSideBarButton", color: "text", iconType: isCollapsed ? 'menuLeft' : 'menuRight', onClick: onClickCollapse })));
}
exports.DefaultEditorSideBar = DefaultEditorSideBar;
