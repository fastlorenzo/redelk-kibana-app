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
exports.getAppInfo = exports.parseAppUrl = exports.relativeToAbsolute = exports.isLegacyApp = exports.appendAppPath = exports.removeSlashes = void 0;
/**
 * Utility to remove trailing, leading or duplicate slashes.
 * By default will only remove duplicates.
 */
exports.removeSlashes = (url, { trailing = false, leading = false, duplicates = true, } = {}) => {
    if (duplicates) {
        url = url.replace(/\/{2,}/g, '/');
    }
    if (trailing) {
        url = url.replace(/\/$/, '');
    }
    if (leading) {
        url = url.replace(/^\//, '');
    }
    return url;
};
exports.appendAppPath = (appBasePath, path = '') => {
    // Only prepend slash if not a hash or query path
    path = path === '' || path.startsWith('#') || path.startsWith('?') ? path : `/${path}`;
    // Do not remove trailing slash when in hashbang
    const removeTrailing = path.indexOf('#') === -1;
    return exports.removeSlashes(`${appBasePath}${path}`, {
        trailing: removeTrailing,
        duplicates: true,
        leading: false,
    });
};
function isLegacyApp(app) {
    return app.legacy === true;
}
exports.isLegacyApp = isLegacyApp;
/**
 * Converts a relative path to an absolute url.
 * Implementation is based on a specified behavior of the browser to automatically convert
 * a relative url to an absolute one when setting the `href` attribute of a `<a>` html element.
 *
 * @example
 * ```ts
 * // current url: `https://kibana:8000/base-path/app/my-app`
 * relativeToAbsolute('/base-path/app/another-app') => `https://kibana:8000/base-path/app/another-app`
 * ```
 */
exports.relativeToAbsolute = (url) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.href;
};
/**
 * Parse given url and return the associated app id and path if any app matches.
 * Input can either be:
 * - a path containing the basePath, ie `/base-path/app/my-app/some-path`
 * - an absolute url matching the `origin` of the kibana instance (as seen by the browser),
 *   i.e `https://kibana:8080/base-path/app/my-app/some-path`
 */
exports.parseAppUrl = (url, basePath, apps, getOrigin = () => window.location.origin) => {
    url = removeBasePath(url, basePath, getOrigin());
    if (!url.startsWith('/')) {
        return undefined;
    }
    for (const app of apps.values()) {
        const appPath = isLegacyApp(app) ? app.appUrl : app.appRoute || `/app/${app.id}`;
        if (url.startsWith(appPath)) {
            const path = url.substr(appPath.length);
            return {
                app: app.id,
                path: path.length ? path : undefined,
            };
        }
    }
};
const removeBasePath = (url, basePath, origin) => {
    if (url.startsWith(origin)) {
        url = url.substring(origin.length);
    }
    return basePath.remove(url);
};
function getAppInfo(app) {
    if (isLegacyApp(app)) {
        const { updater$, ...infos } = app;
        return {
            ...infos,
            status: app.status,
            navLinkStatus: app.navLinkStatus,
            legacy: true,
        };
    }
    else {
        const { updater$, mount, ...infos } = app;
        return {
            ...infos,
            status: app.status,
            navLinkStatus: app.navLinkStatus,
            appRoute: app.appRoute,
            legacy: false,
        };
    }
}
exports.getAppInfo = getAppInfo;
