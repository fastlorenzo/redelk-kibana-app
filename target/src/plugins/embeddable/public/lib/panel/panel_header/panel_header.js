"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeader = void 0;
const tslib_1 = require("tslib");
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
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importDefault(require("react"));
const panel_options_menu_1 = require("./panel_options_menu");
function renderBadges(badges, embeddable) {
    return badges.map((badge) => (react_1.default.createElement(eui_1.EuiBadge, { key: badge.id, className: "embPanel__headerBadge", iconType: badge.getIconType({ embeddable }), onClick: () => badge.execute({ embeddable }), onClickAriaLabel: badge.getDisplayName({ embeddable }) }, badge.getDisplayName({ embeddable }))));
}
function renderNotifications(notifications, embeddable) {
    return notifications.map((notification) => {
        const context = { embeddable };
        let badge = (react_1.default.createElement(eui_1.EuiNotificationBadge, { "data-test-subj": `embeddablePanelNotification-${notification.id}`, key: notification.id, style: { marginTop: '4px', marginRight: '4px' }, onClick: () => notification.execute(context) }, notification.getDisplayName(context)));
        if (notification.getDisplayNameTooltip) {
            const tooltip = notification.getDisplayNameTooltip(context);
            if (tooltip) {
                badge = (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", delay: "regular", content: tooltip, key: notification.id }, badge));
            }
        }
        return badge;
    });
}
function renderTooltip(description) {
    return (description !== '' && (react_1.default.createElement(eui_1.EuiToolTip, { content: description, delay: "regular", position: "right" },
        react_1.default.createElement(eui_1.EuiIcon, { type: "iInCircle" }))));
}
const VISUALIZE_EMBEDDABLE_TYPE = 'visualization';
function getViewDescription(embeddable) {
    if (embeddable.type === VISUALIZE_EMBEDDABLE_TYPE) {
        const description = embeddable.getVisualizationDescription();
        if (description) {
            return description;
        }
    }
    return '';
}
function PanelHeader({ title, isViewMode, hidePanelTitles, getActionContextMenuPanel, closeContextMenu, badges, notifications, embeddable, headerId, }) {
    const viewDescription = getViewDescription(embeddable);
    const showTitle = !isViewMode || (title && !hidePanelTitles) || viewDescription !== '';
    const showPanelBar = badges.length > 0 || showTitle;
    const classes = classnames_1.default('embPanel__header', {
        'embPanel__header--floater': !showPanelBar,
    });
    if (!showPanelBar) {
        return (react_1.default.createElement("div", { className: classes },
            react_1.default.createElement(panel_options_menu_1.PanelOptionsMenu, { getActionContextMenuPanel: getActionContextMenuPanel, isViewMode: isViewMode, closeContextMenu: closeContextMenu, title: title })));
    }
    return (react_1.default.createElement("figcaption", { className: classes, "data-test-subj": `embeddablePanelHeading-${(title || '').replace(/\s/g, '')}` },
        react_1.default.createElement("h2", { id: headerId, "data-test-subj": "dashboardPanelTitle", className: "embPanel__title embPanel__dragger" },
            showTitle ? (react_1.default.createElement("span", { className: "embPanel__titleInner" },
                react_1.default.createElement("span", { className: "embPanel__titleText", "aria-hidden": "true" }, title),
                react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                    react_1.default.createElement("span", null, i18n_1.i18n.translate('embeddableApi.panel.enhancedDashboardPanelAriaLabel', {
                        defaultMessage: 'Dashboard panel: {title}',
                        values: { title },
                    }))),
                renderTooltip(viewDescription))) : (react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                react_1.default.createElement("span", null, i18n_1.i18n.translate('embeddableApi.panel.dashboardPanelAriaLabel', {
                    defaultMessage: 'Dashboard panel',
                })))),
            renderBadges(badges, embeddable)),
        renderNotifications(notifications, embeddable),
        react_1.default.createElement(panel_options_menu_1.PanelOptionsMenu, { isViewMode: isViewMode, getActionContextMenuPanel: getActionContextMenuPanel, closeContextMenu: closeContextMenu, title: title })));
}
exports.PanelHeader = PanelHeader;
