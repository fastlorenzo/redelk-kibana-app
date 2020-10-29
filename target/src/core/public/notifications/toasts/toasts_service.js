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
exports.ToastsService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const global_toast_list_1 = require("./global_toast_list");
const toasts_api_1 = require("./toasts_api");
class ToastsService {
    setup({ uiSettings }) {
        this.api = new toasts_api_1.ToastsApi({ uiSettings });
        return this.api;
    }
    start({ i18n, overlays, targetDomElement }) {
        this.api.start({ overlays, i18n });
        this.targetDomElement = targetDomElement;
        react_dom_1.render(react_1.default.createElement(i18n.Context, null,
            react_1.default.createElement(global_toast_list_1.GlobalToastList, { dismissToast: (toastId) => this.api.remove(toastId), "toasts$": this.api.get$() })), targetDomElement);
        return this.api;
    }
    stop() {
        if (this.targetDomElement) {
            react_dom_1.unmountComponentAtNode(this.targetDomElement);
            this.targetDomElement.textContent = '';
        }
    }
}
exports.ToastsService = ToastsService;
