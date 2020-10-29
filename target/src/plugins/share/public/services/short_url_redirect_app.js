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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortUrlRedirectApp = void 0;
const short_url_routes_1 = require("../../common/short_url_routes");
exports.createShortUrlRedirectApp = (core, location) => ({
    id: 'short_url_redirect',
    appRoute: short_url_routes_1.GOTO_PREFIX,
    chromeless: true,
    title: 'Short URL Redirect',
    async mount() {
        const urlId = short_url_routes_1.getUrlIdFromGotoRoute(location.pathname);
        if (!urlId) {
            throw new Error('Url id not present in path');
        }
        const response = await core.http.get(short_url_routes_1.getUrlPath(urlId));
        const redirectUrl = response.url;
        const { hashUrl } = await Promise.resolve().then(() => __importStar(require('../../../kibana_utils/public')));
        const hashedUrl = hashUrl(redirectUrl);
        const url = core.http.basePath.prepend(hashedUrl);
        location.href = url;
        return () => { };
    },
});
