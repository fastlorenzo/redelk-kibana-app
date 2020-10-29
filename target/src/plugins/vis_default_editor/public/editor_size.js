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
exports.getInitialWidth = exports.DefaultEditorSize = void 0;
var DefaultEditorSize;
(function (DefaultEditorSize) {
    DefaultEditorSize["SMALL"] = "small";
    DefaultEditorSize["MEDIUM"] = "medium";
    DefaultEditorSize["LARGE"] = "large";
})(DefaultEditorSize = exports.DefaultEditorSize || (exports.DefaultEditorSize = {}));
exports.getInitialWidth = (size) => {
    switch (size) {
        case DefaultEditorSize.SMALL:
            return 15;
        case DefaultEditorSize.LARGE:
            return 50;
        case DefaultEditorSize.MEDIUM:
        default:
            return 30;
    }
};
