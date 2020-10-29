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
exports.QueryBarTopRow = void 0;
const tslib_1 = require("tslib");
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
// @ts-ignore
const eui_2 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../kibana_react/public");
const query_string_input_1 = require("./query_string_input");
const common_1 = require("../../../common");
const query_1 = require("../../query");
const no_data_popover_1 = require("./no_data_popover");
function QueryBarTopRow(props) {
    const [isDateRangeInvalid, setIsDateRangeInvalid] = react_1.useState(false);
    const [isQueryInputFocused, setIsQueryInputFocused] = react_1.useState(false);
    const kibana = public_1.useKibana();
    const { uiSettings, notifications, storage, appName, docLinks } = kibana.services;
    const kueryQuerySyntaxLink = docLinks.links.query.kueryQuerySyntax;
    const queryLanguage = props.query && props.query.language;
    const persistedLog = react_1.default.useMemo(() => queryLanguage && uiSettings && storage && appName
        ? query_1.getQueryLog(uiSettings, storage, appName, queryLanguage)
        : undefined, [appName, queryLanguage, uiSettings, storage]);
    function onClickSubmitButton(event) {
        if (persistedLog && props.query) {
            persistedLog.add(props.query.query);
        }
        event.preventDefault();
        onSubmit({ query: props.query, dateRange: getDateRange() });
    }
    function getDateRange() {
        const defaultTimeSetting = uiSettings.get('timepicker:timeDefaults');
        return {
            from: props.dateRangeFrom || defaultTimeSetting.from,
            to: props.dateRangeTo || defaultTimeSetting.to,
        };
    }
    function onQueryChange(query) {
        props.onChange({
            query,
            dateRange: getDateRange(),
        });
    }
    function onChangeQueryInputFocus(isFocused) {
        setIsQueryInputFocused(isFocused);
    }
    function onTimeChange({ start, end, isInvalid, isQuickSelection, }) {
        setIsDateRangeInvalid(isInvalid);
        const retVal = {
            query: props.query,
            dateRange: {
                from: start,
                to: end,
            },
        };
        if (isQuickSelection) {
            props.onSubmit(retVal);
        }
        else {
            props.onChange(retVal);
        }
    }
    function onRefresh({ start, end }) {
        const retVal = {
            dateRange: {
                from: start,
                to: end,
            },
        };
        if (props.onRefresh) {
            props.onRefresh(retVal);
        }
    }
    function onSubmit({ query, dateRange }) {
        handleLuceneSyntaxWarning();
        if (props.timeHistory) {
            props.timeHistory.add(dateRange);
        }
        props.onSubmit({ query, dateRange });
    }
    function onInputSubmit(query) {
        onSubmit({
            query,
            dateRange: getDateRange(),
        });
    }
    function toAbsoluteString(value, roundUp = false) {
        const valueAsMoment = datemath_1.default.parse(value, { roundUp });
        if (!valueAsMoment) {
            return value;
        }
        return valueAsMoment.toISOString();
    }
    function renderQueryInput() {
        if (!shouldRenderQueryInput())
            return;
        return (react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(query_string_input_1.QueryStringInput, { disableAutoFocus: props.disableAutoFocus, indexPatterns: props.indexPatterns, prepend: props.prepend, query: props.query, screenTitle: props.screenTitle, onChange: onQueryChange, onChangeQueryInputFocus: onChangeQueryInputFocus, onSubmit: onInputSubmit, persistedLog: persistedLog, dataTestSubj: props.dataTestSubj })));
    }
    function renderSharingMetaFields() {
        const { from, to } = getDateRange();
        const dateRangePretty = eui_1.prettyDuration(toAbsoluteString(from), toAbsoluteString(to), [], uiSettings.get('dateFormat'));
        return (react_1.default.createElement("div", { "data-shared-timefilter-duration": dateRangePretty, "data-test-subj": "dataSharedTimefilterDuration" }));
    }
    function shouldRenderDatePicker() {
        return Boolean(props.showDatePicker || props.showAutoRefreshOnly);
    }
    function shouldRenderQueryInput() {
        return Boolean(props.showQueryInput && props.indexPatterns && props.query && storage);
    }
    function renderUpdateButton() {
        const button = props.customSubmitButton ? (react_1.default.cloneElement(props.customSubmitButton, { onClick: onClickSubmitButton })) : (react_1.default.createElement(eui_2.EuiSuperUpdateButton, { needsUpdate: props.isDirty, isDisabled: isDateRangeInvalid, isLoading: props.isLoading, onClick: onClickSubmitButton, "data-test-subj": "querySubmitButton" }));
        if (!shouldRenderDatePicker()) {
            return button;
        }
        return (react_1.default.createElement(no_data_popover_1.NoDataPopover, { storage: storage, showNoDataPopover: props.indicateNoData },
            react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: "s" },
                renderDatePicker(),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, button))));
    }
    function renderDatePicker() {
        if (!shouldRenderDatePicker()) {
            return null;
        }
        let recentlyUsedRanges;
        if (props.timeHistory) {
            recentlyUsedRanges = props.timeHistory
                .get()
                .map(({ from, to }) => {
                return {
                    start: from,
                    end: to,
                };
            });
        }
        const commonlyUsedRanges = uiSettings
            .get(common_1.UI_SETTINGS.TIMEPICKER_QUICK_RANGES)
            .map(({ from, to, display }) => {
            return {
                start: from,
                end: to,
                label: display,
            };
        });
        const wrapperClasses = classnames_1.default('kbnQueryBar__datePickerWrapper', {
            'kbnQueryBar__datePickerWrapper-isHidden': isQueryInputFocused,
        });
        return (react_1.default.createElement(eui_1.EuiFlexItem, { className: wrapperClasses },
            react_1.default.createElement(eui_1.EuiSuperDatePicker, { start: props.dateRangeFrom, end: props.dateRangeTo, isPaused: props.isRefreshPaused, refreshInterval: props.refreshInterval, onTimeChange: onTimeChange, onRefresh: onRefresh, onRefreshChange: props.onRefreshChange, showUpdateButton: false, recentlyUsedRanges: recentlyUsedRanges, commonlyUsedRanges: commonlyUsedRanges, dateFormat: uiSettings.get('dateFormat'), isAutoRefreshOnly: props.showAutoRefreshOnly, className: "kbnQueryBar__datePicker" })));
    }
    function handleLuceneSyntaxWarning() {
        if (!props.query)
            return;
        const { query, language } = props.query;
        if (language === 'kuery' &&
            typeof query === 'string' &&
            (!storage || !storage.get('kibana.luceneSyntaxWarningOptOut')) &&
            common_1.doesKueryExpressionHaveLuceneSyntaxError(query)) {
            const toast = notifications.toasts.addWarning({
                title: i18n_1.i18n.translate('data.query.queryBar.luceneSyntaxWarningTitle', {
                    defaultMessage: 'Lucene syntax warning',
                }),
                text: public_1.toMountPoint(react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "data.query.queryBar.luceneSyntaxWarningMessage", defaultMessage: "It looks like you may be trying to use Lucene query syntax, although you\n               have Kibana Query Language (KQL) selected. Please review the KQL docs {link}.", values: {
                                link: (react_1.default.createElement(eui_1.EuiLink, { href: kueryQuerySyntaxLink, target: "_blank" },
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "data.query.queryBar.syntaxOptionsDescription.docsLinkText", defaultMessage: "here" }))),
                            } })),
                    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButton, { size: "s", onClick: () => onLuceneSyntaxWarningOptOut(toast) },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "data.query.queryBar.luceneSyntaxWarningOptOutText", defaultMessage: "Don't show again" })))))),
            });
        }
    }
    function onLuceneSyntaxWarningOptOut(toast) {
        if (!storage)
            return;
        storage.set('kibana.luceneSyntaxWarningOptOut', true);
        notifications.toasts.remove(toast);
    }
    const classes = classnames_1.default('kbnQueryBar', {
        'kbnQueryBar--withDatePicker': props.showDatePicker,
    });
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { className: classes, responsive: !!props.showDatePicker, gutterSize: "s", justifyContent: "flexEnd" },
        renderQueryInput(),
        renderSharingMetaFields(),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, renderUpdateButton())));
}
exports.QueryBarTopRow = QueryBarTopRow;
QueryBarTopRow.defaultProps = {
    showQueryInput: true,
    showDatePicker: true,
    showAutoRefreshOnly: false,
};
