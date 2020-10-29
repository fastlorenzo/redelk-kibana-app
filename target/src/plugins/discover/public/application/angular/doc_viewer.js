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
exports.createDocViewerDirective = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const doc_viewer_1 = require("../components/doc_viewer/doc_viewer");
function createDocViewerDirective(reactDirective) {
    return reactDirective((props) => {
        return react_1.default.createElement(doc_viewer_1.DocViewer, Object.assign({}, props));
    }, [
        'hit',
        ['indexPattern', { watchDepth: 'reference' }],
        ['filter', { watchDepth: 'reference' }],
        ['columns', { watchDepth: 'collection' }],
        ['onAddColumn', { watchDepth: 'reference' }],
        ['onRemoveColumn', { watchDepth: 'reference' }],
    ], {
        restrict: 'E',
        scope: {
            hit: '=',
            indexPattern: '=',
            filter: '=?',
            columns: '=?',
            onAddColumn: '=?',
            onRemoveColumn: '=?',
        },
    });
}
exports.createDocViewerDirective = createDocViewerDirective;
