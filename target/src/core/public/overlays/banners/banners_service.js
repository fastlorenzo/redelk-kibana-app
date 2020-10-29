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
exports.OverlayBannersService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const priority_map_1 = require("./priority_map");
const banners_list_1 = require("./banners_list");
const user_banner_service_1 = require("./user_banner_service");
/** @internal */
class OverlayBannersService {
    constructor() {
        this.userBanner = new user_banner_service_1.UserBannerService();
    }
    start({ i18n, uiSettings }) {
        let uniqueId = 0;
        const genId = () => `${uniqueId++}`;
        const banners$ = new rxjs_1.BehaviorSubject(new priority_map_1.PriorityMap());
        const service = {
            add: (mount, priority = 0) => {
                const id = genId();
                const nextBanner = { id, mount, priority };
                banners$.next(banners$.value.add(id, nextBanner));
                return id;
            },
            remove: (id) => {
                if (!banners$.value.has(id)) {
                    return false;
                }
                banners$.next(banners$.value.remove(id));
                return true;
            },
            replace(id, mount, priority = 0) {
                if (!id || !banners$.value.has(id)) {
                    return this.add(mount, priority);
                }
                const nextId = genId();
                const nextBanner = { id: nextId, mount, priority };
                banners$.next(banners$.value.remove(id).add(nextId, nextBanner));
                return nextId;
            },
            get$() {
                return banners$.pipe(operators_1.map((bannerMap) => [...bannerMap.values()]));
            },
            getComponent() {
                return react_1.default.createElement(banners_list_1.BannersList, { "banners$": this.get$() });
            },
        };
        this.userBanner.start({ banners: service, i18n, uiSettings });
        return service;
    }
    stop() {
        this.userBanner.stop();
    }
}
exports.OverlayBannersService = OverlayBannersService;
