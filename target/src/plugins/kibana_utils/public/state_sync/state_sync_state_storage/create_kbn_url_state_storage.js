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
exports.createKbnUrlStateStorage = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const url_1 = require("../../state_management/url");
/**
 * Creates {@link IKbnUrlStateStorage} state storage
 * @returns - {@link IKbnUrlStateStorage}
 * @public
 */
exports.createKbnUrlStateStorage = ({ useHash = false, history } = { useHash: false }) => {
    const url = url_1.createKbnUrlControls(history);
    return {
        set: (key, state, { replace = false } = { replace: false }) => {
            // syncState() utils doesn't wait for this promise
            return url.updateAsync((currentUrl) => url_1.setStateToKbnUrl(key, state, { useHash }, currentUrl), replace);
        },
        get: (key) => {
            // if there is a pending url update, then state will be extracted from that pending url,
            // otherwise current url will be used to retrieve state from
            return url_1.getStateFromKbnUrl(key, url.getPendingUrl());
        },
        change$: (key) => new rxjs_1.Observable((observer) => {
            const unlisten = url.listen(() => {
                observer.next();
            });
            return () => {
                unlisten();
            };
        }).pipe(operators_1.map(() => url_1.getStateFromKbnUrl(key)), operators_1.share()),
        flush: ({ replace = false } = {}) => {
            return !!url.flush(replace);
        },
        cancel() {
            url.cancel();
        },
    };
};
