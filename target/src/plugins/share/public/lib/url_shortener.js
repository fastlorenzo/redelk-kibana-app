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
exports.shortenUrl = void 0;
const tslib_1 = require("tslib");
const url_1 = tslib_1.__importDefault(require("url"));
const short_url_routes_1 = require("../../common/short_url_routes");
async function shortenUrl(absoluteUrl, { basePath, post }) {
    const parsedUrl = url_1.default.parse(absoluteUrl);
    if (!parsedUrl || !parsedUrl.path) {
        return;
    }
    const path = parsedUrl.path.replace(basePath, '');
    const hash = parsedUrl.hash ? parsedUrl.hash : '';
    const relativeUrl = path + hash;
    const body = JSON.stringify({ url: relativeUrl });
    const resp = await post(short_url_routes_1.CREATE_PATH, { body });
    return url_1.default.format({
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        pathname: `${basePath}${short_url_routes_1.getGotoPath(resp.urlId)}`,
    });
}
exports.shortenUrl = shortenUrl;
