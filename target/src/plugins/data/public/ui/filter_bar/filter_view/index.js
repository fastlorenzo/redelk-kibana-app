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
exports.FilterView = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const filter_label_1 = require("../filter_editor/lib/filter_label");
const common_1 = require("../../../../common");
exports.FilterView = ({ filter, iconOnClick, onClick, valueLabel, errorMessage, ...rest }) => {
    const [ref, innerText] = eui_1.useInnerText();
    let title = errorMessage ||
        i18n_1.i18n.translate('data.filter.filterBar.moreFilterActionsMessage', {
            defaultMessage: 'Filter: {innerText}. Select for more filter actions.',
            values: { innerText },
        });
    if (common_1.isFilterPinned(filter)) {
        title = `${i18n_1.i18n.translate('data.filter.filterBar.pinnedFilterPrefix', {
            defaultMessage: 'Pinned',
        })} ${title}`;
    }
    if (filter.meta.disabled) {
        title = `${i18n_1.i18n.translate('data.filter.filterBar.disabledFilterPrefix', {
            defaultMessage: 'Disabled',
        })} ${title}`;
    }
    return (react_1.default.createElement(eui_1.EuiBadge, Object.assign({ title: title, color: "hollow", iconType: "cross", iconSide: "right", closeButtonProps: {
            // Removing tab focus on close button because the same option can be optained through the context menu
            // Also, we may want to add a `DEL` keyboard press functionality
            tabIndex: -1,
        }, iconOnClick: iconOnClick, iconOnClickAriaLabel: i18n_1.i18n.translate('data.filter.filterBar.filterItemBadgeIconAriaLabel', {
            defaultMessage: 'Delete',
        }), onClick: onClick, onClickAriaLabel: i18n_1.i18n.translate('data.filter.filterBar.filterItemBadgeAriaLabel', {
            defaultMessage: 'Filter actions',
        }) }, rest),
        react_1.default.createElement("span", { ref: ref },
            react_1.default.createElement(filter_label_1.FilterLabel, { filter: filter, valueLabel: valueLabel }))));
};
