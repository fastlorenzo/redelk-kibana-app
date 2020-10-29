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
exports.NavLinksService = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const to_nav_link_1 = require("./to_nav_link");
class NavLinksService {
    constructor() {
        this.stop$ = new rxjs_1.ReplaySubject(1);
    }
    start({ application, http }) {
        const appLinks$ = application.applications$.pipe(operators_1.map((apps) => {
            return new Map([...apps]
                .filter(([, app]) => !app.chromeless)
                .map(([appId, app]) => [appId, to_nav_link_1.toNavLink(app, http.basePath)]));
        }));
        // now that availableApps$ is an observable, we need to keep record of all
        // manual link modifications to be able to re-apply then after every
        // availableApps$ changes.
        const linkUpdaters$ = new rxjs_1.BehaviorSubject([]);
        const navLinks$ = new rxjs_1.BehaviorSubject(new Map());
        rxjs_1.combineLatest([appLinks$, linkUpdaters$])
            .pipe(operators_1.map(([appLinks, linkUpdaters]) => {
            return linkUpdaters.reduce((links, updater) => updater(links), appLinks);
        }))
            .subscribe((navlinks) => {
            navLinks$.next(navlinks);
        });
        const forceAppSwitcherNavigation$ = new rxjs_1.BehaviorSubject(false);
        return {
            getNavLinks$: () => {
                return navLinks$.pipe(operators_1.map(sortNavLinks), operators_1.takeUntil(this.stop$));
            },
            get(id) {
                const link = navLinks$.value.get(id);
                return link && link.properties;
            },
            getAll() {
                return sortNavLinks(navLinks$.value);
            },
            has(id) {
                return navLinks$.value.has(id);
            },
            showOnly(id) {
                if (!this.has(id)) {
                    return;
                }
                const updater = (navLinks) => new Map([...navLinks.entries()].filter(([linkId]) => linkId === id));
                linkUpdaters$.next([...linkUpdaters$.value, updater]);
            },
            update(id, values) {
                if (!this.has(id)) {
                    return;
                }
                const updater = (navLinks) => new Map([...navLinks.entries()].map(([linkId, link]) => {
                    return [linkId, link.id === id ? link.update(values) : link];
                }));
                linkUpdaters$.next([...linkUpdaters$.value, updater]);
                return this.get(id);
            },
            enableForcedAppSwitcherNavigation() {
                forceAppSwitcherNavigation$.next(true);
            },
            getForceAppSwitcherNavigation$() {
                return forceAppSwitcherNavigation$.asObservable();
            },
        };
    }
    stop() {
        this.stop$.next();
    }
}
exports.NavLinksService = NavLinksService;
function sortNavLinks(navLinks) {
    return lodash_1.sortBy([...navLinks.values()].map((link) => link.properties), 'order');
}
