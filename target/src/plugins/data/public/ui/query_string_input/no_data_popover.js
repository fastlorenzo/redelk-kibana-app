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
exports.NoDataPopover = void 0;
const tslib_1 = require("tslib");
const react_1 = require("react");
const react_2 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const NO_DATA_POPOVER_STORAGE_KEY = 'data.noDataPopover';
function NoDataPopover({ showNoDataPopover, storage, children, }) {
    const [noDataPopoverDismissed, setNoDataPopoverDismissed] = react_1.useState(() => Boolean(storage.get(NO_DATA_POPOVER_STORAGE_KEY)));
    const [noDataPopoverVisible, setNoDataPopoverVisible] = react_1.useState(false);
    react_1.useEffect(() => {
        if (showNoDataPopover && !noDataPopoverDismissed) {
            setNoDataPopoverVisible(true);
        }
    }, [noDataPopoverDismissed, showNoDataPopover]);
    return (react_2.default.createElement(eui_1.EuiTourStep, { onFinish: () => { }, closePopover: () => {
            setNoDataPopoverVisible(false);
        }, content: react_2.default.createElement(eui_1.EuiText, { size: "s" },
            react_2.default.createElement("p", { style: { maxWidth: 300 } }, i18n_1.i18n.translate('data.noDataPopover.content', {
                defaultMessage: "This time range doesn't contain any data. Increase or adjust the time range to see more fields and create charts.",
            }))), minWidth: 300, anchorPosition: "downCenter", step: 1, stepsTotal: 1, isStepOpen: noDataPopoverVisible, subtitle: i18n_1.i18n.translate('data.noDataPopover.subtitle', { defaultMessage: 'Tip' }), title: i18n_1.i18n.translate('data.noDataPopover.title', { defaultMessage: 'Empty dataset' }), footerAction: react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", flush: "right", color: "text", "data-test-subj": "noDataPopoverDismissButton", onClick: () => {
                storage.set(NO_DATA_POPOVER_STORAGE_KEY, true);
                setNoDataPopoverDismissed(true);
                setNoDataPopoverVisible(false);
            } }, i18n_1.i18n.translate('data.noDataPopover.dismissAction', {
            defaultMessage: "Don't show again",
        })) },
        react_2.default.createElement("div", { onFocus: () => {
                setNoDataPopoverVisible(false);
            } }, children)));
}
exports.NoDataPopover = NoDataPopover;
