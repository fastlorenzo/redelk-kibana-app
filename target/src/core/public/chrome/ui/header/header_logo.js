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
exports.HeaderLogo = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const react_use_1 = require("react-use");
const url_1 = tslib_1.__importDefault(require("url"));
function findClosestAnchor(element) {
    let current = element;
    while (current) {
        if (current.tagName === 'A') {
            return current;
        }
        if (!current.parentElement || current.parentElement === document.body) {
            return undefined;
        }
        current = current.parentElement;
    }
}
function onClick(event, forceNavigation, navLinks, navigateToApp) {
    const anchor = findClosestAnchor(event.nativeEvent.target);
    if (!anchor) {
        return;
    }
    const navLink = navLinks.find((item) => item.href === anchor.href);
    if (navLink && navLink.disabled) {
        event.preventDefault();
        return;
    }
    if (event.isDefaultPrevented() || event.altKey || event.metaKey || event.ctrlKey) {
        return;
    }
    if (forceNavigation) {
        const toParsed = url_1.default.parse(anchor.href);
        const fromParsed = url_1.default.parse(document.location.href);
        const sameProto = toParsed.protocol === fromParsed.protocol;
        const sameHost = toParsed.host === fromParsed.host;
        const samePath = toParsed.path === fromParsed.path;
        if (sameProto && sameHost && samePath) {
            if (toParsed.hash) {
                document.location.reload();
            }
            // event.preventDefault() keeps the browser from seeing the new url as an update
            // and even setting window.location does not mimic that behavior, so instead
            // we use stopPropagation() to prevent angular from seeing the click and
            // starting a digest cycle/attempting to handle it in the router.
            event.stopPropagation();
        }
    }
    else {
        navigateToApp('home');
        event.preventDefault();
    }
}
function HeaderLogo({ href, navigateToApp, ...observables }) {
    const forceNavigation = react_use_1.useObservable(observables.forceNavigation$, false);
    const navLinks = react_use_1.useObservable(observables.navLinks$, []);
    return (react_1.default.createElement(eui_1.EuiHeaderLogo, { "data-test-subj": "logo", iconType: "logoElastic", onClick: (e) => onClick(e, forceNavigation, navLinks, navigateToApp), href: href, "aria-label": i18n_1.i18n.translate('core.ui.chrome.headerGlobalNav.goHomePageIconAriaLabel', {
            defaultMessage: 'Go to home page',
        }) }));
}
exports.HeaderLogo = HeaderLogo;
