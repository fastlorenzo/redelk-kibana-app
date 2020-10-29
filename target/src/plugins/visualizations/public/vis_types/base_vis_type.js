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
exports.BaseVisType = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
class BaseVisType {
    constructor(opts) {
        if (!opts.icon && !opts.image) {
            throw new Error('vis_type must define its icon or image');
        }
        const defaultOptions = {
            // controls the visualize editor
            showTimePicker: true,
            showQueryBar: true,
            showFilterBar: true,
            showIndexSelection: true,
            hierarchicalData: false,
        };
        this.name = opts.name;
        this.description = opts.description || '';
        this.getSupportedTriggers = opts.getSupportedTriggers;
        this.title = opts.title;
        this.icon = opts.icon;
        this.image = opts.image;
        this.visualization = opts.visualization;
        this.visConfig = lodash_1.default.defaultsDeep({}, opts.visConfig, { defaults: {} });
        this.editor = opts.editor;
        this.editorConfig = lodash_1.default.defaultsDeep({}, opts.editorConfig, { collections: {} });
        this.options = lodash_1.default.defaultsDeep({}, opts.options, defaultOptions);
        this.stage = opts.stage || 'production';
        this.isExperimental = opts.stage === 'experimental';
        this.hidden = opts.hidden || false;
        this.requestHandler = opts.requestHandler || 'courier';
        this.responseHandler = opts.responseHandler || 'none';
        this.setup = opts.setup;
        this.requiresSearch = this.requestHandler !== 'none';
        this.hierarchicalData = opts.hierarchicalData || false;
        this.useCustomNoDataScreen = opts.useCustomNoDataScreen || false;
    }
    get schemas() {
        if (this.editorConfig && this.editorConfig.schemas) {
            return this.editorConfig.schemas;
        }
        return [];
    }
}
exports.BaseVisType = BaseVisType;
