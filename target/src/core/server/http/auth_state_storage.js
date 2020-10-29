"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStateStorage = exports.AuthStatus = void 0;
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
const router_1 = require("./router");
/**
 * Status indicating an outcome of the authentication.
 * @public
 */
var AuthStatus;
(function (AuthStatus) {
    /**
     * `auth` interceptor successfully authenticated a user
     */
    AuthStatus["authenticated"] = "authenticated";
    /**
     * `auth` interceptor failed user authentication
     */
    AuthStatus["unauthenticated"] = "unauthenticated";
    /**
     * `auth` interceptor has not been registered
     */
    AuthStatus["unknown"] = "unknown";
})(AuthStatus = exports.AuthStatus || (exports.AuthStatus = {}));
/** @internal */
class AuthStateStorage {
    constructor(canBeAuthenticated) {
        this.canBeAuthenticated = canBeAuthenticated;
        this.storage = new WeakMap();
        this.set = (request, state) => {
            this.storage.set(router_1.ensureRawRequest(request), state);
        };
        this.get = (request) => {
            const key = router_1.ensureRawRequest(request);
            const state = this.storage.get(key);
            const status = this.storage.has(key)
                ? AuthStatus.authenticated
                : this.canBeAuthenticated()
                    ? AuthStatus.unauthenticated
                    : AuthStatus.unknown;
            return { status, state };
        };
        this.isAuthenticated = (request) => {
            return this.get(request).status === AuthStatus.authenticated;
        };
    }
}
exports.AuthStateStorage = AuthStateStorage;
