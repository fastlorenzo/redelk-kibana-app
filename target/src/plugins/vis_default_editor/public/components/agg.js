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
exports.DefaultEditorAgg = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const agg_params_1 = require("./agg_params");
const agg_group_state_1 = require("./agg_group_state");
const rows_or_columns_1 = require("./controls/rows_or_columns");
const radius_ratio_option_1 = require("./controls/radius_ratio_option");
const schemas_1 = require("../schemas");
const agg_params_helper_1 = require("./agg_params_helper");
function DefaultEditorAgg({ agg, aggIndex, aggIsTooLow, dragHandleProps, formIsTouched, groupName, isDisabled, isDraggable, isLastBucket, isRemovable, metricAggs, lastParentPipelineAggTitle, state, setAggParamValue, setStateParamValue, onAggTypeChange, onToggleEnableAgg, removeAgg, setAggsState, schemas, timeRange, }) {
    const [isEditorOpen, setIsEditorOpen] = react_1.useState(agg.brandNew);
    const [validState, setValidState] = react_1.useState(true);
    const showDescription = !isEditorOpen && validState;
    const showError = !isEditorOpen && !validState;
    const aggName = agg.type?.name;
    let disabledParams;
    let aggError;
    // When a Parent Pipeline agg is selected and this agg is the last bucket.
    const isLastBucketAgg = isLastBucket && lastParentPipelineAggTitle && agg.type;
    let SchemaComponent;
    if (agg.schema === 'split') {
        SchemaComponent = rows_or_columns_1.RowsOrColumnsControl;
    }
    if (agg.schema === 'radius') {
        SchemaComponent = radius_ratio_option_1.RadiusRatioOptionControl;
    }
    if (isLastBucketAgg) {
        if (['date_histogram', 'histogram'].includes(aggName)) {
            disabledParams = ['min_doc_count'];
        }
        else {
            aggError = i18n_1.i18n.translate('visDefaultEditor.metrics.wrongLastBucketTypeErrorMessage', {
                defaultMessage: 'Last bucket aggregation must be "Date Histogram" or "Histogram" when using "{type}" metric aggregation.',
                values: { type: lastParentPipelineAggTitle },
                description: 'Date Histogram and Histogram should not be translated',
            });
        }
    }
    const [aggDescription, setAggDescription] = react_1.useState(agg_params_helper_1.buildAggDescription(agg));
    // This useEffect is required to update the timeRange value and initiate rerender to keep labels up to date (Issue #57822).
    react_1.useEffect(() => {
        if (timeRange && aggName === 'date_histogram') {
            agg.aggConfigs.setTimeRange(timeRange);
        }
        setAggDescription(agg_params_helper_1.buildAggDescription(agg));
    }, [agg, aggName, timeRange]);
    react_1.useEffect(() => {
        if (isLastBucketAgg && ['date_histogram', 'histogram'].includes(aggName)) {
            setAggParamValue(agg.id, 'min_doc_count', 
            // "histogram" agg has an editor for "min_doc_count" param, which accepts boolean
            // "date_histogram" agg doesn't have an editor for "min_doc_count" param, it should be set as a numeric value
            aggName === 'histogram' ? true : 0);
        }
    }, [aggName, isLastBucketAgg, agg.id, setAggParamValue]);
    const setTouched = react_1.useCallback((touched) => {
        setAggsState({
            type: agg_group_state_1.AGGS_ACTION_KEYS.TOUCHED,
            payload: touched,
            aggId: agg.id,
        });
    }, [agg.id, setAggsState]);
    const setValidity = react_1.useCallback((isValid) => {
        setAggsState({
            type: agg_group_state_1.AGGS_ACTION_KEYS.VALID,
            payload: isValid,
            aggId: agg.id,
        });
        setValidState(isValid);
    }, [agg.id, setAggsState]);
    const onToggle = react_1.useCallback((isOpen) => {
        setIsEditorOpen(isOpen);
        if (!isOpen) {
            setTouched(true);
        }
    }, [setTouched]);
    const renderAggButtons = () => {
        const actionIcons = [];
        if (showError) {
            actionIcons.push({
                id: 'hasErrors',
                color: 'danger',
                type: 'alert',
                tooltip: i18n_1.i18n.translate('visDefaultEditor.agg.errorsAriaLabel', {
                    defaultMessage: 'Aggregation has errors',
                }),
                dataTestSubj: 'hasErrorsAggregationIcon',
            });
        }
        if (agg.enabled && isRemovable) {
            actionIcons.push({
                id: 'disableAggregation',
                color: 'text',
                disabled: isDisabled,
                type: 'eye',
                onClick: () => onToggleEnableAgg(agg.id, false),
                tooltip: i18n_1.i18n.translate('visDefaultEditor.agg.disableAggButtonTooltip', {
                    defaultMessage: 'Disable aggregation',
                }),
                dataTestSubj: 'toggleDisableAggregationBtn disable',
            });
        }
        if (!agg.enabled) {
            actionIcons.push({
                id: 'enableAggregation',
                color: 'text',
                type: 'eyeClosed',
                onClick: () => onToggleEnableAgg(agg.id, true),
                tooltip: i18n_1.i18n.translate('visDefaultEditor.agg.enableAggButtonTooltip', {
                    defaultMessage: 'Enable aggregation',
                }),
                dataTestSubj: 'toggleDisableAggregationBtn enable',
            });
        }
        if (isDraggable) {
            actionIcons.push({
                id: 'dragHandle',
                type: 'grab',
                tooltip: i18n_1.i18n.translate('visDefaultEditor.agg.modifyPriorityButtonTooltip', {
                    defaultMessage: 'Modify priority by dragging',
                }),
                dataTestSubj: 'dragHandleBtn',
            });
        }
        if (isRemovable) {
            actionIcons.push({
                id: 'removeDimension',
                color: 'danger',
                type: 'cross',
                onClick: () => removeAgg(agg.id),
                tooltip: i18n_1.i18n.translate('visDefaultEditor.agg.removeDimensionButtonTooltip', {
                    defaultMessage: 'Remove dimension',
                }),
                dataTestSubj: 'removeDimensionBtn',
            });
        }
        return (react_1.default.createElement("div", Object.assign({}, dragHandleProps), actionIcons.map((icon) => {
            if (icon.id === 'dragHandle') {
                return (react_1.default.createElement(eui_1.EuiIconTip, { key: icon.id, type: icon.type, content: icon.tooltip, iconProps: {
                        ['aria-label']: icon.tooltip,
                        ['data-test-subj']: icon.dataTestSubj,
                    }, position: "bottom" }));
            }
            return (react_1.default.createElement(eui_1.EuiToolTip, { key: icon.id, position: "bottom", content: icon.tooltip },
                react_1.default.createElement(eui_1.EuiButtonIcon, { disabled: icon.disabled, iconType: icon.type, color: icon.color, onClick: icon.onClick, "aria-label": icon.tooltip, "data-test-subj": icon.dataTestSubj })));
        })));
    };
    const schemaTitle = schemas_1.getSchemaByName(schemas, agg.schema).title;
    const buttonContent = (react_1.default.createElement(react_1.default.Fragment, null,
        schemaTitle || agg.schema,
        " ",
        showDescription && react_1.default.createElement("span", null, aggDescription)));
    return (react_1.default.createElement(eui_1.EuiAccordion, { id: `visEditorAggAccordion${agg.id}`, initialIsOpen: isEditorOpen, buttonContent: buttonContent, buttonClassName: "eui-textTruncate", buttonContentClassName: "visEditorSidebar__aggGroupAccordionButtonContent eui-textTruncate", className: "visEditorSidebar__section visEditorSidebar__collapsible visEditorSidebar__collapsible--marginBottom", "aria-label": i18n_1.i18n.translate('visDefaultEditor.agg.toggleEditorButtonAriaLabel', {
            defaultMessage: 'Toggle {schema} editor',
            values: { schema: schemaTitle || agg.schema },
        }), "data-test-subj": `visEditorAggAccordion${agg.id}`, extraAction: renderAggButtons(), onToggle: onToggle },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            SchemaComponent && (react_1.default.createElement(SchemaComponent, { agg: agg, editorStateParams: state.params, setAggParamValue: setAggParamValue, setStateParamValue: setStateParamValue })),
            react_1.default.createElement(agg_params_1.DefaultEditorAggParams, { agg: agg, aggError: aggError, aggIndex: aggIndex, aggIsTooLow: aggIsTooLow, disabledParams: disabledParams, formIsTouched: formIsTouched, groupName: groupName, indexPattern: agg.getIndexPattern(), metricAggs: metricAggs, state: state, setAggParamValue: setAggParamValue, onAggTypeChange: onAggTypeChange, setTouched: setTouched, setValidity: setValidity, schemas: schemas }))));
}
exports.DefaultEditorAgg = DefaultEditorAgg;
