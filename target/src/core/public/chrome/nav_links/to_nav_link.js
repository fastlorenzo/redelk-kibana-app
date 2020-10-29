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
exports.relativeToAbsolute = exports.toNavLink = void 0;
const application_1 = require("../../application");
const nav_link_1 = require("./nav_link");
const utils_1 = require("../../application/utils");
function toNavLink(app, basePath) {
    const useAppStatus = app.navLinkStatus === application_1.AppNavLinkStatus.default;
    const relativeBaseUrl = isLegacyApp(app)
        ? basePath.prepend(app.appUrl)
        : basePath.prepend(app.appRoute);
    const url = relativeToAbsolute(utils_1.appendAppPath(relativeBaseUrl, app.defaultPath));
    const baseUrl = relativeToAbsolute(relativeBaseUrl);
    return new nav_link_1.NavLinkWrapper({
        ...app,
        hidden: useAppStatus
            ? app.status === application_1.AppStatus.inaccessible
            : app.navLinkStatus === application_1.AppNavLinkStatus.hidden,
        disabled: useAppStatus ? false : app.navLinkStatus === application_1.AppNavLinkStatus.disabled,
        legacy: isLegacyApp(app),
        baseUrl,
        ...(isLegacyApp(app)
            ? {
                href: url && !url.startsWith(app.subUrlBase) ? url : baseUrl,
            }
            : {
                href: url,
                url,
            }),
    });
}
exports.toNavLink = toNavLink;
/**
 * @param {string} url - a relative or root relative url.  If a relative path is given then the
 * absolute url returned will depend on the current page where this function is called from. For example
 * if you are on page "http://www.mysite.com/shopping/kids" and you pass this function "adults", you would get
 * back "http://www.mysite.com/shopping/adults".  If you passed this function a root relative path, or one that
 * starts with a "/", for example "/account/cart", you would get back "http://www.mysite.com/account/cart".
 * @return {string} the relative url transformed into an absolute url
 */
function relativeToAbsolute(url) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.href;
}
exports.relativeToAbsolute = relativeToAbsolute;
function isLegacyApp(app) {
    return app.legacy === true;
}
