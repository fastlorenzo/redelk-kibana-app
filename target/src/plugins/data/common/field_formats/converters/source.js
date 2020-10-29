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
exports.SourceFormat = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../../utils");
const types_1 = require("../../kbn_field_types/types");
const field_format_1 = require("../field_format");
const types_2 = require("../types");
const __1 = require("../../");
/**
 * Remove all of the whitespace between html tags
 * so that inline elements don't have extra spaces.
 *
 * If you have inline elements (span, a, em, etc.) and any
 * amount of whitespace around them in your markup, then the
 * browser will push them apart. This is ugly in certain
 * scenarios and is only fixed by removing the whitespace
 * from the html in the first place (or ugly css hacks).
 *
 * @param  {string} html - the html to modify
 * @return {string} - modified html
 */
function noWhiteSpace(html) {
    const TAGS_WITH_WS = />\s+</g;
    return html.replace(TAGS_WITH_WS, '><');
}
const templateHtml = `
  <dl class="source truncate-by-height">
    <% defPairs.forEach(function (def) { %>
      <dt><%- def[0] %>:</dt>
      <dd><%= def[1] %></dd>
      <%= ' ' %>
    <% }); %>
  </dl>`;
const doTemplate = lodash_1.template(noWhiteSpace(templateHtml));
class SourceFormat extends field_format_1.FieldFormat {
    constructor() {
        super(...arguments);
        this.textConvert = (value) => JSON.stringify(value);
        this.htmlConvert = (value, options = {}) => {
            const { field, hit } = options;
            if (!field) {
                const converter = this.getConverterFor('text');
                return lodash_1.escape(converter(value));
            }
            const highlights = (hit && hit.highlight) || {};
            const formatted = field.indexPattern.formatHit(hit);
            const highlightPairs = [];
            const sourcePairs = [];
            const isShortDots = this.getConfig(__1.UI_SETTINGS.SHORT_DOTS_ENABLE);
            lodash_1.keys(formatted).forEach((key) => {
                const pairs = highlights[key] ? highlightPairs : sourcePairs;
                const newField = isShortDots ? utils_1.shortenDottedString(key) : key;
                const val = formatted[key];
                pairs.push([newField, val]);
            }, []);
            return doTemplate({ defPairs: highlightPairs.concat(sourcePairs) });
        };
    }
}
exports.SourceFormat = SourceFormat;
SourceFormat.id = types_2.FIELD_FORMAT_IDS._SOURCE;
SourceFormat.title = '_source';
SourceFormat.fieldType = types_1.KBN_FIELD_TYPES._SOURCE;
