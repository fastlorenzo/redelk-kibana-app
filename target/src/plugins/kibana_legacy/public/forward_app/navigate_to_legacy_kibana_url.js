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
exports.navigateToLegacyKibanaUrl = void 0;
const normalize_path_1 = require("../utils/normalize_path");
exports.navigateToLegacyKibanaUrl = (path, forwards, basePath, application) => {
    const normalizedPath = normalize_path_1.normalizePath(path);
    // try to find an existing redirect for the target path if possible
    // this avoids having to load the legacy app just to get redirected to a core application again afterwards
    const relevantForward = forwards.find((forward) => normalizedPath.startsWith(`/${forward.legacyAppId}`));
    if (!relevantForward) {
        return { navigated: false };
    }
    const targetAppPath = relevantForward.rewritePath(normalizedPath);
    const targetAppId = relevantForward.newAppId;
    application.navigateToApp(targetAppId, { path: targetAppPath, replace: true });
    return { navigated: true };
};
