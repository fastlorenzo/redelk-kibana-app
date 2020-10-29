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
exports.MappedColors = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const d3_1 = tslib_1.__importDefault(require("d3"));
const common_1 = require("../../../common");
const color_palette_1 = require("./color_palette");
const standardizeColor = (color) => d3_1.default.rgb(color).toString();
/**
 * Maintains a lookup table that associates the value (key) with a hex color (value)
 * across the visualizations.
 * Provides functions to interact with the lookup table
 */
class MappedColors {
    constructor(uiSettings) {
        this.uiSettings = uiSettings;
        this._oldMap = {};
        this._mapping = {};
    }
    getConfigColorMapping() {
        return lodash_1.default.mapValues(this.uiSettings.get(common_1.COLOR_MAPPING_SETTING), standardizeColor);
    }
    get oldMap() {
        return this._oldMap;
    }
    get mapping() {
        return this._mapping;
    }
    get(key) {
        return this.getConfigColorMapping()[key] || this._mapping[key];
    }
    flush() {
        this._oldMap = lodash_1.default.clone(this._mapping);
        this._mapping = {};
    }
    purge() {
        this._oldMap = {};
        this._mapping = {};
    }
    mapKeys(keys) {
        const configMapping = this.getConfigColorMapping();
        const configColors = lodash_1.default.values(configMapping);
        const oldColors = lodash_1.default.values(this._oldMap);
        const keysToMap = [];
        lodash_1.default.each(keys, (key) => {
            // If this key is mapped in the config, it's unnecessary to have it mapped here
            if (configMapping[key])
                delete this._mapping[key];
            // If this key is mapped to a color used by the config color mapping, we need to remap it
            if (lodash_1.default.includes(configColors, this._mapping[key]))
                keysToMap.push(key);
            // if key exist in oldMap, move it to mapping
            if (this._oldMap[key])
                this._mapping[key] = this._oldMap[key];
            // If this key isn't mapped, we need to map it
            if (this.get(key) == null)
                keysToMap.push(key);
        });
        // Generate a color palette big enough that all new keys can have unique color values
        const allColors = lodash_1.default(this._mapping).values().union(configColors).union(oldColors).value();
        const colorPalette = color_palette_1.createColorPalette(allColors.length + keysToMap.length);
        let newColors = lodash_1.default.difference(colorPalette, allColors);
        while (keysToMap.length > newColors.length) {
            newColors = newColors.concat(lodash_1.default.sampleSize(allColors, keysToMap.length - newColors.length));
        }
        lodash_1.default.merge(this._mapping, lodash_1.default.zipObject(keysToMap, newColors));
    }
}
exports.MappedColors = MappedColors;
