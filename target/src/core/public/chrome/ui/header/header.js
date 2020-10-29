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
exports.Header = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importStar(require("react"));
const react_use_1 = require("react-use");
const __1 = require("../");
const collapsible_nav_1 = require("./collapsible_nav");
const header_badge_1 = require("./header_badge");
const header_breadcrumbs_1 = require("./header_breadcrumbs");
const header_help_menu_1 = require("./header_help_menu");
const header_logo_1 = require("./header_logo");
const header_nav_controls_1 = require("./header_nav_controls");
const nav_drawer_1 = require("./nav_drawer");
function renderMenuTrigger(toggleOpen) {
    return (react_1.default.createElement(eui_1.EuiHeaderSectionItemButton, { "aria-label": i18n_1.i18n.translate('core.ui.chrome.headerGlobalNav.toggleSideNavAriaLabel', {
            defaultMessage: 'Toggle side navigation',
        }), onClick: toggleOpen },
        react_1.default.createElement(eui_1.EuiIcon, { type: "apps", size: "m" })));
}
function Header({ kibanaVersion, kibanaDocLink, legacyMode, application, basePath, onIsLockedUpdate, homeHref, ...observables }) {
    const isVisible = react_use_1.useObservable(observables.isVisible$, true);
    const navType = react_use_1.useObservable(observables.navType$, 'modern');
    const isLocked = react_use_1.useObservable(observables.isLocked$, false);
    const [isOpen, setIsOpen] = react_1.useState(false);
    if (!isVisible) {
        return react_1.default.createElement(__1.LoadingIndicator, { "loadingCount$": observables.loadingCount$ });
    }
    const navDrawerRef = react_1.createRef();
    const toggleCollapsibleNavRef = react_1.createRef();
    const navId = eui_1.htmlIdGenerator()();
    const className = classnames_1.default('chrHeaderWrapper', // TODO #64541 - delete this
    'hide-for-sharing', {
        'chrHeaderWrapper--navIsLocked': isLocked,
        headerWrapper: navType === 'modern',
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(__1.LoadingIndicator, { "loadingCount$": observables.loadingCount$ }),
        react_1.default.createElement("header", { className: className, "data-test-subj": "headerGlobalNav" },
            react_1.default.createElement(eui_1.EuiHeader, { position: "fixed" },
                react_1.default.createElement(eui_1.EuiHeaderSection, { grow: false },
                    navType === 'modern' ? (react_1.default.createElement(eui_1.EuiHeaderSectionItem, { border: "right", className: "header__toggleNavButtonSection" },
                        react_1.default.createElement(eui_1.EuiHeaderSectionItemButton, { "data-test-subj": "toggleNavButton", "aria-label": i18n_1.i18n.translate('core.ui.primaryNav.toggleNavAriaLabel', {
                                defaultMessage: 'Toggle primary navigation',
                            }), onClick: () => setIsOpen(!isOpen), "aria-expanded": isOpen, "aria-pressed": isOpen, "aria-controls": navId, ref: toggleCollapsibleNavRef },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "menu", size: "m" })))) : (
                    // TODO #64541
                    // Delete this block
                    react_1.default.createElement(eui_1.EuiShowFor, { sizes: ['xs', 's'] },
                        react_1.default.createElement(eui_1.EuiHeaderSectionItem, { border: "right" }, renderMenuTrigger(() => navDrawerRef.current?.toggleOpen())))),
                    react_1.default.createElement(eui_1.EuiHeaderSectionItem, { border: "right" },
                        react_1.default.createElement(header_logo_1.HeaderLogo, { href: homeHref, "forceNavigation$": observables.forceAppSwitcherNavigation$, "navLinks$": observables.navLinks$, navigateToApp: application.navigateToApp })),
                    react_1.default.createElement(header_nav_controls_1.HeaderNavControls, { side: "left", "navControls$": observables.navControlsLeft$ })),
                react_1.default.createElement(header_breadcrumbs_1.HeaderBreadcrumbs, { "appTitle$": observables.appTitle$, "breadcrumbs$": observables.breadcrumbs$ }),
                react_1.default.createElement(header_badge_1.HeaderBadge, { "badge$": observables.badge$ }),
                react_1.default.createElement(eui_1.EuiHeaderSection, { side: "right" },
                    react_1.default.createElement(eui_1.EuiHeaderSectionItem, null,
                        react_1.default.createElement(header_help_menu_1.HeaderHelpMenu, { "helpExtension$": observables.helpExtension$, "helpSupportUrl$": observables.helpSupportUrl$, kibanaDocLink: kibanaDocLink, kibanaVersion: kibanaVersion })),
                    react_1.default.createElement(header_nav_controls_1.HeaderNavControls, { side: "right", "navControls$": observables.navControlsRight$ }))),
            navType === 'modern' ? (react_1.default.createElement(collapsible_nav_1.CollapsibleNav, { "appId$": application.currentAppId$, id: navId, isLocked: isLocked, "navLinks$": observables.navLinks$, "recentlyAccessed$": observables.recentlyAccessed$, isOpen: isOpen, homeHref: homeHref, basePath: basePath, legacyMode: legacyMode, navigateToApp: application.navigateToApp, onIsLockedUpdate: onIsLockedUpdate, closeNav: () => {
                    setIsOpen(false);
                    if (toggleCollapsibleNavRef.current) {
                        toggleCollapsibleNavRef.current.focus();
                    }
                }, "customNavLink$": observables.customNavLink$ })) : (
            // TODO #64541
            // Delete this block
            react_1.default.createElement(nav_drawer_1.NavDrawer, { isLocked: isLocked, onIsLockedUpdate: onIsLockedUpdate, "navLinks$": observables.navLinks$, "recentlyAccessed$": observables.recentlyAccessed$, basePath: basePath, "appId$": application.currentAppId$, navigateToApp: application.navigateToApp, ref: navDrawerRef, legacyMode: legacyMode })))));
}
exports.Header = Header;
