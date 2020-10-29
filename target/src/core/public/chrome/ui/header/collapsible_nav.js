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
exports.CollapsibleNav = void 0;
const tslib_1 = require("tslib");
require("./collapsible_nav.scss");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const react_use_1 = require("react-use");
const nav_link_1 = require("./nav_link");
function getAllCategories(allCategorizedLinks) {
    const allCategories = {};
    for (const [key, value] of Object.entries(allCategorizedLinks)) {
        allCategories[key] = value[0].category;
    }
    return allCategories;
}
function getOrderedCategories(mainCategories, categoryDictionary) {
    return lodash_1.sortBy(Object.keys(mainCategories), (categoryName) => categoryDictionary[categoryName]?.order);
}
function getCategoryLocalStorageKey(id) {
    return `core.navGroup.${id}`;
}
function getIsCategoryOpen(id, storage) {
    const value = storage.getItem(getCategoryLocalStorageKey(id)) ?? 'true';
    return value === 'true';
}
function setIsCategoryOpen(id, isOpen, storage) {
    storage.setItem(getCategoryLocalStorageKey(id), `${isOpen}`);
}
function CollapsibleNav({ basePath, id, isLocked, isOpen, homeHref, legacyMode, storage = window.localStorage, onIsLockedUpdate, closeNav, navigateToApp, ...observables }) {
    const navLinks = react_use_1.useObservable(observables.navLinks$, []).filter((link) => !link.hidden);
    const recentlyAccessed = react_use_1.useObservable(observables.recentlyAccessed$, []);
    const customNavLink = react_use_1.useObservable(observables.customNavLink$, undefined);
    const appId = react_use_1.useObservable(observables.appId$, '');
    const lockRef = react_1.useRef(null);
    const groupedNavLinks = lodash_1.groupBy(navLinks, (link) => link?.category?.id);
    const { undefined: unknowns = [], ...allCategorizedLinks } = groupedNavLinks;
    const categoryDictionary = getAllCategories(allCategorizedLinks);
    const orderedCategories = getOrderedCategories(allCategorizedLinks, categoryDictionary);
    const readyForEUI = (link, needsIcon = false) => {
        return nav_link_1.createEuiListItem({
            link,
            legacyMode,
            appId,
            dataTestSubj: 'collapsibleNavAppLink',
            navigateToApp,
            onClick: closeNav,
            ...(needsIcon && { basePath }),
        });
    };
    return (react_1.default.createElement(eui_1.EuiCollapsibleNav, { "data-test-subj": "collapsibleNav", id: id, "aria-label": i18n_1.i18n.translate('core.ui.primaryNav.screenReaderLabel', {
            defaultMessage: 'Primary',
        }), isOpen: isOpen, isDocked: isLocked, onClose: closeNav },
        customNavLink && (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { flexShrink: 0 } },
                react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, { background: "light", className: "eui-yScroll", style: { maxHeight: '40vh' } },
                    react_1.default.createElement(eui_1.EuiListGroup, { listItems: [
                            nav_link_1.createEuiListItem({
                                link: customNavLink,
                                legacyMode,
                                basePath,
                                navigateToApp,
                                dataTestSubj: 'collapsibleNavCustomNavLink',
                                onClick: closeNav,
                                externalLink: true,
                            }),
                        ], maxWidth: "none", color: "text", gutterSize: "none", size: "s" }))),
            react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "none" }))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { flexShrink: 0 } },
            react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, { background: "light", className: "eui-yScroll", style: { maxHeight: '40vh' } },
                react_1.default.createElement(eui_1.EuiListGroup, { "aria-label": i18n_1.i18n.translate('core.ui.primaryNav.pinnedLinksAriaLabel', {
                        defaultMessage: 'Pinned links',
                    }), listItems: [
                        {
                            label: 'Home',
                            iconType: 'home',
                            href: homeHref,
                            onClick: (event) => {
                                if (nav_link_1.isModifiedOrPrevented(event)) {
                                    return;
                                }
                                event.preventDefault();
                                closeNav();
                                navigateToApp('home');
                            },
                        },
                    ], maxWidth: "none", color: "text", gutterSize: "none", size: "s" }))),
        react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, { key: "recentlyViewed", background: "light", title: i18n_1.i18n.translate('core.ui.recentlyViewed', { defaultMessage: 'Recently viewed' }), isCollapsible: true, initialIsOpen: getIsCategoryOpen('recentlyViewed', storage), onToggle: (isCategoryOpen) => setIsCategoryOpen('recentlyViewed', isCategoryOpen, storage), "data-test-subj": "collapsibleNavGroup-recentlyViewed" }, recentlyAccessed.length > 0 ? (react_1.default.createElement(eui_1.EuiListGroup, { "aria-label": i18n_1.i18n.translate('core.ui.recentlyViewedAriaLabel', {
                defaultMessage: 'Recently viewed links',
            }), listItems: recentlyAccessed.map((link) => {
                // TODO #64541
                // Can remove icon from recent links completely
                const { iconType, ...hydratedLink } = nav_link_1.createRecentNavLink(link, navLinks, basePath);
                return {
                    ...hydratedLink,
                    'data-test-subj': 'collapsibleNavAppLink--recent',
                    onClick: (event) => {
                        if (nav_link_1.isModifiedOrPrevented(event)) {
                            return;
                        }
                        closeNav();
                    },
                };
            }), maxWidth: "none", color: "subdued", gutterSize: "none", size: "s", className: "kbnCollapsibleNav__recentsListGroup" })) : (react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued", style: { padding: '0 8px 8px' } },
            react_1.default.createElement("p", null, i18n_1.i18n.translate('core.ui.EmptyRecentlyViewed', {
                defaultMessage: 'No recently viewed items',
            }))))),
        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "none" }),
        react_1.default.createElement(eui_1.EuiFlexItem, { className: "eui-yScroll" },
            orderedCategories.map((categoryName) => {
                const category = categoryDictionary[categoryName];
                return (react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, { key: category.id, iconType: category.euiIconType, title: category.label, isCollapsible: true, initialIsOpen: getIsCategoryOpen(category.id, storage), onToggle: (isCategoryOpen) => setIsCategoryOpen(category.id, isCategoryOpen, storage), "data-test-subj": `collapsibleNavGroup-${category.id}` },
                    react_1.default.createElement(eui_1.EuiListGroup, { "aria-label": i18n_1.i18n.translate('core.ui.primaryNavSection.screenReaderLabel', {
                            defaultMessage: 'Primary navigation links, {category}',
                            values: { category: category.label },
                        }), listItems: allCategorizedLinks[categoryName].map((link) => readyForEUI(link)), maxWidth: "none", color: "subdued", gutterSize: "none", size: "s" })));
            }),
            unknowns.map((link, i) => (react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, { "data-test-subj": `collapsibleNavGroup-noCategory`, key: i },
                react_1.default.createElement(eui_1.EuiListGroup, { flush: true },
                    react_1.default.createElement(eui_1.EuiListGroupItem, Object.assign({ color: "text", size: "s" }, readyForEUI(link, true))))))),
            react_1.default.createElement(eui_1.EuiShowFor, { sizes: ['l', 'xl'] },
                react_1.default.createElement(eui_1.EuiCollapsibleNavGroup, null,
                    react_1.default.createElement(eui_1.EuiListGroup, { flush: true },
                        react_1.default.createElement(eui_1.EuiListGroupItem, { "data-test-subj": "collapsible-nav-lock", buttonRef: lockRef, size: "xs", color: "subdued", label: isLocked
                                ? i18n_1.i18n.translate('core.ui.primaryNavSection.undockLabel', {
                                    defaultMessage: 'Undock navigation',
                                })
                                : i18n_1.i18n.translate('core.ui.primaryNavSection.dockLabel', {
                                    defaultMessage: 'Dock navigation',
                                }), "aria-label": isLocked
                                ? i18n_1.i18n.translate('core.ui.primaryNavSection.undockAriaLabel', {
                                    defaultMessage: 'Undock primary navigation',
                                })
                                : i18n_1.i18n.translate('core.ui.primaryNavSection.dockAriaLabel', {
                                    defaultMessage: 'Dock primary navigation',
                                }), onClick: () => {
                                onIsLockedUpdate(!isLocked);
                                if (lockRef.current) {
                                    lockRef.current.focus();
                                }
                            }, iconType: isLocked ? 'lock' : 'lockOpen' })))))));
}
exports.CollapsibleNav = CollapsibleNav;
