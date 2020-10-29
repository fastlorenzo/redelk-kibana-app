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
exports.getRelativeToHistoryPath = exports.createKbnUrlControls = exports.setStateToKbnUrl = exports.getStateFromKbnUrl = exports.getStatesFromKbnUrl = void 0;
const url_1 = require("url");
const query_string_1 = require("query-string");
const history_1 = require("history");
const state_encoder_1 = require("../state_encoder");
const parse_1 = require("./parse");
const format_1 = require("./format");
const common_1 = require("../../../common");
/**
 * Parses a kibana url and retrieves all the states encoded into url,
 * Handles both expanded rison state and hashed state (where the actual state stored in sessionStorage)
 * e.g.:
 *
 * given an url:
 * http://localhost:5601/oxf/app/kibana#/yourApp?_a=(tab:indexedFields)&_b=(f:test,i:'',l:'')
 * will return object:
 * {_a: {tab: 'indexedFields'}, _b: {f: 'test', i: '', l: ''}};
 */
function getStatesFromKbnUrl(url = window.location.href, keys) {
    const query = parse_1.parseUrlHash(url)?.query;
    if (!query)
        return {};
    const decoded = {};
    Object.entries(query)
        .filter(([key]) => (keys ? keys.includes(key) : true))
        .forEach(([q, value]) => {
        decoded[q] = state_encoder_1.decodeState(value);
    });
    return decoded;
}
exports.getStatesFromKbnUrl = getStatesFromKbnUrl;
/**
 * Retrieves specific state from url by key
 * e.g.:
 *
 * given an url:
 * http://localhost:5601/oxf/app/kibana#/yourApp?_a=(tab:indexedFields)&_b=(f:test,i:'',l:'')
 * and key '_a'
 * will return object:
 * {tab: 'indexedFields'}
 */
function getStateFromKbnUrl(key, url = window.location.href) {
    return getStatesFromKbnUrl(url, [key])[key] || null;
}
exports.getStateFromKbnUrl = getStateFromKbnUrl;
/**
 * Sets state to the url by key and returns a new url string.
 * Doesn't actually updates history
 *
 * e.g.:
 * given a url: http://localhost:5601/oxf/app/kibana#/yourApp?_a=(tab:indexedFields)&_b=(f:test,i:'',l:'')
 * key: '_a'
 * and state: {tab: 'other'}
 *
 * will return url:
 * http://localhost:5601/oxf/app/kibana#/yourApp?_a=(tab:other)&_b=(f:test,i:'',l:'')
 */
function setStateToKbnUrl(key, state, { useHash = false } = { useHash: false }, rawUrl = window.location.href) {
    return format_1.replaceUrlHashQuery(rawUrl, (query) => {
        const encoded = state_encoder_1.encodeState(state, useHash);
        return {
            ...query,
            [key]: encoded,
        };
    });
}
exports.setStateToKbnUrl = setStateToKbnUrl;
exports.createKbnUrlControls = (history = history_1.createBrowserHistory()) => {
    const updateQueue = [];
    // if we should replace or push with next async update,
    // if any call in a queue asked to push, then we should push
    let shouldReplace = true;
    function updateUrl(newUrl, replace = false) {
        const currentUrl = parse_1.getCurrentUrl(history);
        if (newUrl === currentUrl)
            return undefined; // skip update
        const historyPath = getRelativeToHistoryPath(newUrl, history);
        if (replace) {
            history.replace(historyPath);
        }
        else {
            history.push(historyPath);
        }
        return parse_1.getCurrentUrl(history);
    }
    // queue clean up
    function cleanUp() {
        updateQueue.splice(0, updateQueue.length);
        shouldReplace = true;
    }
    // runs scheduled url updates
    function flush(replace = shouldReplace) {
        const nextUrl = getPendingUrl();
        if (!nextUrl)
            return;
        cleanUp();
        const newUrl = updateUrl(nextUrl, replace);
        return newUrl;
    }
    function getPendingUrl() {
        if (updateQueue.length === 0)
            return undefined;
        const resultUrl = updateQueue.reduce((url, nextUpdate) => nextUpdate(url), parse_1.getCurrentUrl(history));
        return resultUrl;
    }
    return {
        listen: (cb) => history.listen(() => {
            cb();
        }),
        update: (newUrl, replace = false) => updateUrl(newUrl, replace),
        updateAsync: (updater, replace = false) => {
            updateQueue.push(updater);
            if (shouldReplace) {
                shouldReplace = replace;
            }
            // Schedule url update to the next microtask
            // this allows to batch synchronous url changes
            return Promise.resolve().then(() => {
                return flush();
            });
        },
        flush: (replace) => {
            return flush(replace);
        },
        cancel: () => {
            cleanUp();
        },
        getPendingUrl: () => {
            return getPendingUrl();
        },
    };
};
/**
 * Depending on history configuration extracts relative path for history updates
 * 4 possible cases (see tests):
 * 1. Browser history with empty base path
 * 2. Browser history with base path
 * 3. Hash history with empty base path
 * 4. Hash history with base path
 */
function getRelativeToHistoryPath(absoluteUrl, history) {
    function stripBasename(path = '') {
        const stripLeadingHash = (_) => (_.charAt(0) === '#' ? _.substr(1) : _);
        const stripTrailingSlash = (_) => _.charAt(_.length - 1) === '/' ? _.substr(0, _.length - 1) : _;
        const baseName = stripLeadingHash(stripTrailingSlash(history.createHref({})));
        return path.startsWith(baseName) ? path.substr(baseName.length) : path;
    }
    const isHashHistory = history.createHref({}).includes('#');
    const parsedUrl = isHashHistory ? parse_1.parseUrlHash(absoluteUrl) : parse_1.parseUrl(absoluteUrl);
    const parsedHash = isHashHistory ? null : parse_1.parseUrlHash(absoluteUrl);
    return url_1.format({
        pathname: stripBasename(parsedUrl.pathname),
        search: query_string_1.stringify(common_1.url.encodeQuery(parsedUrl.query), { sort: false, encode: false }),
        hash: parsedHash
            ? url_1.format({
                pathname: parsedHash.pathname,
                search: query_string_1.stringify(common_1.url.encodeQuery(parsedHash.query), { sort: false, encode: false }),
            })
            : parsedUrl.hash,
    });
}
exports.getRelativeToHistoryPath = getRelativeToHistoryPath;
