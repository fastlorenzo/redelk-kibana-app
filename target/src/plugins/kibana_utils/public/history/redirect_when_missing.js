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
exports.redirectWhenMissing = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_markdown_1 = tslib_1.__importDefault(require("react-markdown"));
function addNotFoundToPath(path, error) {
    return (path +
        (path.indexOf('?') >= 0 ? '&' : '?') +
        `notFound=${error.savedObjectType}&notFoundMessage=${error.message}`);
}
/**
 * Creates an error handler that will redirect to a url when a SavedObjectNotFound
 * error is thrown
 */
function redirectWhenMissing({ history, navigateToApp, basePath, mapping, toastNotifications, onBeforeRedirect, }) {
    let localMappingObject;
    if (typeof mapping === 'string') {
        localMappingObject = { '*': mapping };
    }
    else {
        localMappingObject = mapping;
    }
    return (error) => {
        // if this error is not "404", rethrow
        // we can't check "error instanceof SavedObjectNotFound" since this class can live in a separate bundle
        // and the error will be an instance of other class with the same interface (actually the copy of SavedObjectNotFound class)
        if (!error.savedObjectType) {
            throw error;
        }
        let redirectTarget = localMappingObject[error.savedObjectType] || localMappingObject['*'] || '/';
        if (typeof redirectTarget !== 'string') {
            redirectTarget.path = addNotFoundToPath(redirectTarget.path, error);
        }
        else {
            redirectTarget = addNotFoundToPath(redirectTarget, error);
        }
        toastNotifications.addWarning({
            title: i18n_1.i18n.translate('kibana_utils.history.savedObjectIsMissingNotificationMessage', {
                defaultMessage: 'Saved object is missing',
            }),
            text: (element) => {
                react_dom_1.default.render(react_1.default.createElement(react_markdown_1.default, { renderers: {
                        root: react_1.Fragment,
                    } }, error.message), element);
                return () => react_dom_1.default.unmountComponentAtNode(element);
            },
        });
        if (onBeforeRedirect) {
            onBeforeRedirect(error);
        }
        if (typeof redirectTarget !== 'string') {
            if (redirectTarget.app === 'kibana') {
                // exception for kibana app because redirect won't work right otherwise
                window.location.href = basePath.prepend(`/app/kibana${redirectTarget.path}`);
            }
            else {
                navigateToApp(redirectTarget.app, { path: redirectTarget.path });
            }
        }
        else {
            history.replace(redirectTarget);
        }
    };
}
exports.redirectWhenMissing = redirectWhenMissing;
