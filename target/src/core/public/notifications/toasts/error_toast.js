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
exports.ErrorToast = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const isRequestError = (e) => {
    if ('body' in e) {
        return e.body?.attributes?.error?.caused_by !== undefined;
    }
    return false;
};
/**
 * This should instead be replaced by the overlay service once it's available.
 * This does not use React portals so that if the parent toast times out, this modal
 * does not disappear. NOTE: this should use a global modal in the overlay service
 * in the future.
 */
function showErrorDialog({ title, error, openModal, i18nContext, }) {
    const I18nContext = i18nContext();
    let text = '';
    if (isRequestError(error)) {
        text += `${error?.body?.attributes?.error?.caused_by.type}\n`;
        text += `${error?.body?.attributes?.error?.caused_by.reason}\n\n`;
    }
    if (error.stack) {
        text += error.stack;
    }
    const modal = openModal(mount(react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(I18nContext, null,
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, title)),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiCallOut, { size: "s", color: "danger", iconType: "alert", title: error.message }),
                text && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(eui_2.EuiSpacer, { size: "s" }),
                    react_1.default.createElement(eui_1.EuiCodeBlock, { isCopyable: true, paddingSize: "s" }, text)))),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButton, { onClick: () => modal.close(), fill: true },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "core.notifications.errorToast.closeModal", defaultMessage: "Close" })))))));
}
function ErrorToast({ title, error, toastMessage, openModal, i18nContext, }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("p", { "data-test-subj": "errorToastMessage" }, toastMessage),
        react_1.default.createElement("div", { className: "eui-textRight" },
            react_1.default.createElement(eui_1.EuiButton, { size: "s", color: "danger", onClick: () => showErrorDialog({ title, error, openModal, i18nContext }) },
                react_1.default.createElement(react_2.FormattedMessage, { id: "core.toasts.errorToast.seeFullError", defaultMessage: "See the full error" })))));
}
exports.ErrorToast = ErrorToast;
const mount = (component) => (container) => {
    react_dom_1.default.render(component, container);
    return () => react_dom_1.default.unmountComponentAtNode(container);
};
