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
exports.RequestDetailsResponse = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_1 = require("@elastic/eui");
class RequestDetailsResponse extends react_1.Component {
    render() {
        const responseJSON = RequestDetailsResponse.getResponseJson(this.props.request);
        if (!responseJSON) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", paddingSize: "s", isCopyable: true, "data-test-subj": "inspectorResponseBody" }, JSON.stringify(responseJSON, null, 2)));
    }
}
exports.RequestDetailsResponse = RequestDetailsResponse;
RequestDetailsResponse.propTypes = {
    request: prop_types_1.default.object.isRequired,
};
RequestDetailsResponse.shouldShow = (request) => Boolean(RequestDetailsResponse.getResponseJson(request));
RequestDetailsResponse.getResponseJson = (request) => (request.response ? request.response.json : null);
