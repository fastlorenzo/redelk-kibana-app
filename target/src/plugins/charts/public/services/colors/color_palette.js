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
exports.createColorPalette = void 0;
const tslib_1 = require("tslib");
const d3_1 = tslib_1.__importDefault(require("d3"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const seed_colors_1 = require("./seed_colors");
const offset = 300; // Hue offset to start at
const fraction = function (goal) {
    const walkTree = (numerator, denominator, bytes) => {
        if (bytes.length) {
            return walkTree(numerator * 2 + (bytes.pop() ? 1 : -1), denominator * 2, bytes);
        }
        else {
            return numerator / denominator;
        }
    };
    const b = (goal + 2)
        .toString(2)
        .split('')
        .map(function (num) {
        return parseInt(num, 10);
    });
    b.shift();
    return walkTree(1, 2, b);
};
/**
 * Generates an array of hex colors the length of the input number.
 * If the number is greater than the length of seed colors available,
 * new colors are generated up to the value of the input number.
 */
function createColorPalette(num) {
    if (!lodash_1.default.isNumber(num)) {
        throw new TypeError('ColorPaletteUtilService expects a number');
    }
    const colors = seed_colors_1.seedColors;
    const seedLength = seed_colors_1.seedColors.length;
    lodash_1.default.times(num - seedLength, function (i) {
        colors.push(d3_1.default.hsl((fraction(i + seedLength + 1) * 360 + offset) % 360, 0.5, 0.5).toString());
    });
    return colors;
}
exports.createColorPalette = createColorPalette;
