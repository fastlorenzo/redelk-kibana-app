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
exports.ChromeService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const url_1 = require("url");
const eui_1 = require("@elastic/eui");
const mount_1 = require("../utils/mount");
const constants_1 = require("./constants");
const doc_title_1 = require("./doc_title");
const nav_controls_1 = require("./nav_controls");
const nav_links_1 = require("./nav_links");
const recently_accessed_1 = require("./recently_accessed");
const ui_1 = require("./ui");
const IS_LOCKED_KEY = 'core.chrome.isLocked';
/** @internal */
class ChromeService {
    constructor(params) {
        this.params = params;
        this.stop$ = new rxjs_1.ReplaySubject(1);
        this.navControls = new nav_controls_1.NavControlsService();
        this.navLinks = new nav_links_1.NavLinksService();
        this.recentlyAccessed = new recently_accessed_1.RecentlyAccessedService();
        this.docTitle = new doc_title_1.DocTitleService();
    }
    /**
     * These observables allow consumers to toggle the chrome visibility via either:
     *   1. Using setIsVisible() to trigger the next chromeHidden$
     *   2. Setting `chromeless` when registering an application, which will
     *      reset the visibility whenever the next application is mounted
     *   3. Having "embed" in the query string
     */
    initVisibility(application) {
        // Start off the chrome service hidden if "embed" is in the hash query string.
        const isEmbedded = 'embed' in url_1.parse(location.hash.slice(1), true).query;
        this.isForceHidden$ = new rxjs_1.BehaviorSubject(isEmbedded);
        const appHidden$ = rxjs_1.merge(
        // For the isVisible$ logic, having no mounted app is equivalent to having a hidden app
        // in the sense that the chrome UI should not be displayed until a non-chromeless app is mounting or mounted
        rxjs_1.of(true), application.currentAppId$.pipe(operators_1.flatMap((appId) => application.applications$.pipe(operators_1.map((applications) => {
            return !!appId && applications.has(appId) && !!applications.get(appId).chromeless;
        })))));
        this.isVisible$ = rxjs_1.combineLatest([appHidden$, this.isForceHidden$]).pipe(operators_1.map(([appHidden, forceHidden]) => !appHidden && !forceHidden), operators_1.takeUntil(this.stop$));
    }
    async start({ application, docLinks, http, injectedMetadata, notifications, uiSettings, }) {
        this.initVisibility(application);
        const appTitle$ = new rxjs_1.BehaviorSubject('Kibana');
        const brand$ = new rxjs_1.BehaviorSubject({});
        const applicationClasses$ = new rxjs_1.BehaviorSubject(new Set());
        const helpExtension$ = new rxjs_1.BehaviorSubject(undefined);
        const breadcrumbs$ = new rxjs_1.BehaviorSubject([]);
        const badge$ = new rxjs_1.BehaviorSubject(undefined);
        const customNavLink$ = new rxjs_1.BehaviorSubject(undefined);
        const helpSupportUrl$ = new rxjs_1.BehaviorSubject(constants_1.KIBANA_ASK_ELASTIC_LINK);
        const isNavDrawerLocked$ = new rxjs_1.BehaviorSubject(localStorage.getItem(IS_LOCKED_KEY) === 'true');
        const navControls = this.navControls.start();
        const navLinks = this.navLinks.start({ application, http });
        const recentlyAccessed = await this.recentlyAccessed.start({ http });
        const docTitle = this.docTitle.start({ document: window.document });
        const setIsNavDrawerLocked = (isLocked) => {
            isNavDrawerLocked$.next(isLocked);
            localStorage.setItem(IS_LOCKED_KEY, `${isLocked}`);
        };
        const getIsNavDrawerLocked$ = isNavDrawerLocked$.pipe(operators_1.takeUntil(this.stop$));
        // TODO #64541
        // Can delete
        const getNavType$ = uiSettings.get$('pageNavigation').pipe(operators_1.takeUntil(this.stop$));
        const isIE = () => {
            const ua = window.navigator.userAgent;
            const msie = ua.indexOf('MSIE '); // IE 10 or older
            const trident = ua.indexOf('Trident/'); // IE 11
            return msie > 0 || trident > 0;
        };
        if (!this.params.browserSupportsCsp && injectedMetadata.getCspConfig().warnLegacyBrowsers) {
            notifications.toasts.addWarning({
                title: mount_1.mountReactNode(react_1.default.createElement(react_2.FormattedMessage, { id: "core.chrome.legacyBrowserWarning", defaultMessage: "Your browser does not meet the security requirements for Kibana." })),
            });
        }
        if (isIE()) {
            notifications.toasts.addWarning({
                title: mount_1.mountReactNode(react_1.default.createElement(react_2.FormattedMessage, { id: "core.chrome.browserDeprecationWarning", defaultMessage: "Support for Internet Explorer will be dropped in future versions of this software, please check {link}.", values: {
                        link: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: "https://www.elastic.co/support/matrix", external: true },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "core.chrome.browserDeprecationLink", defaultMessage: "the support matrix on our website" }))),
                    } })),
            });
        }
        return {
            navControls,
            navLinks,
            recentlyAccessed,
            docTitle,
            getHeaderComponent: () => (react_1.default.createElement(ui_1.Header, { "loadingCount$": http.getLoadingCount$(), application: application, "appTitle$": appTitle$.pipe(operators_1.takeUntil(this.stop$)), "badge$": badge$.pipe(operators_1.takeUntil(this.stop$)), basePath: http.basePath, "breadcrumbs$": breadcrumbs$.pipe(operators_1.takeUntil(this.stop$)), "customNavLink$": customNavLink$.pipe(operators_1.takeUntil(this.stop$)), kibanaDocLink: docLinks.links.kibana, "forceAppSwitcherNavigation$": navLinks.getForceAppSwitcherNavigation$(), "helpExtension$": helpExtension$.pipe(operators_1.takeUntil(this.stop$)), "helpSupportUrl$": helpSupportUrl$.pipe(operators_1.takeUntil(this.stop$)), homeHref: http.basePath.prepend('/app/home'), "isVisible$": this.isVisible$, kibanaVersion: injectedMetadata.getKibanaVersion(), legacyMode: injectedMetadata.getLegacyMode(), "navLinks$": navLinks.getNavLinks$(), "recentlyAccessed$": recentlyAccessed.get$(), "navControlsLeft$": navControls.getLeft$(), "navControlsRight$": navControls.getRight$(), onIsLockedUpdate: setIsNavDrawerLocked, "isLocked$": getIsNavDrawerLocked$, "navType$": getNavType$ })),
            setAppTitle: (appTitle) => appTitle$.next(appTitle),
            getBrand$: () => brand$.pipe(operators_1.takeUntil(this.stop$)),
            setBrand: (brand) => {
                brand$.next(Object.freeze({
                    logo: brand.logo,
                    smallLogo: brand.smallLogo,
                }));
            },
            getIsVisible$: () => this.isVisible$,
            setIsVisible: (isVisible) => this.isForceHidden$.next(!isVisible),
            getApplicationClasses$: () => applicationClasses$.pipe(operators_1.map((set) => [...set]), operators_1.takeUntil(this.stop$)),
            addApplicationClass: (className) => {
                const update = new Set([...applicationClasses$.getValue()]);
                update.add(className);
                applicationClasses$.next(update);
            },
            removeApplicationClass: (className) => {
                const update = new Set([...applicationClasses$.getValue()]);
                update.delete(className);
                applicationClasses$.next(update);
            },
            getBadge$: () => badge$.pipe(operators_1.takeUntil(this.stop$)),
            setBadge: (badge) => {
                badge$.next(badge);
            },
            getBreadcrumbs$: () => breadcrumbs$.pipe(operators_1.takeUntil(this.stop$)),
            setBreadcrumbs: (newBreadcrumbs) => {
                breadcrumbs$.next(newBreadcrumbs);
            },
            getHelpExtension$: () => helpExtension$.pipe(operators_1.takeUntil(this.stop$)),
            setHelpExtension: (helpExtension) => {
                helpExtension$.next(helpExtension);
            },
            setHelpSupportUrl: (url) => helpSupportUrl$.next(url),
            getIsNavDrawerLocked$: () => getIsNavDrawerLocked$,
            getNavType$: () => getNavType$,
            getCustomNavLink$: () => customNavLink$.pipe(operators_1.takeUntil(this.stop$)),
            setCustomNavLink: (customNavLink) => {
                customNavLink$.next(customNavLink);
            },
        };
    }
    stop() {
        this.navLinks.stop();
        this.stop$.next();
    }
}
exports.ChromeService = ChromeService;
