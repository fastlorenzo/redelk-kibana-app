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
exports.I18nService = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_eui_mapping_1 = require("./i18n_eui_mapping");
/**
 * Service that is responsible for i18n capabilities.
 * @internal
 */
class I18nService {
    /**
     * Used exclusively to give a Context component to FatalErrorsService which
     * may render before Core successfully sets up or starts.
     *
     * Separated from `start` to disambiguate that this can be called from within
     * Core outside the lifecycle flow.
     * @internal
     */
    getContext() {
        const mapping = {
            ...i18n_eui_mapping_1.euiContextMapping,
        };
        return {
            Context: function I18nContext({ children }) {
                return (react_1.default.createElement(react_2.I18nProvider, null,
                    react_1.default.createElement(eui_1.EuiContext, { i18n: { mapping } }, children)));
            },
        };
    }
    start() {
        return this.getContext();
    }
    stop() {
        // nothing to do here currently
    }
}
exports.I18nService = I18nService;
