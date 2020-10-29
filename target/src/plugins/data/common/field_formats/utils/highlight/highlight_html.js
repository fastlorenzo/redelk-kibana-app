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
exports.getHighlightHtml = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const highlight_tags_1 = require("./highlight_tags");
const html_tags_1 = require("./html_tags");
function getHighlightHtml(fieldValue, highlights) {
    let highlightHtml = typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue;
    lodash_1.default.each(highlights, function (highlight) {
        const escapedHighlight = lodash_1.default.escape(highlight);
        // Strip out the highlight tags to compare against the field text
        const untaggedHighlight = escapedHighlight
            .split(highlight_tags_1.highlightTags.pre)
            .join('')
            .split(highlight_tags_1.highlightTags.post)
            .join('');
        // Replace all highlight tags with proper html tags
        const taggedHighlight = escapedHighlight
            .split(highlight_tags_1.highlightTags.pre)
            .join(html_tags_1.htmlTags.pre)
            .split(highlight_tags_1.highlightTags.post)
            .join(html_tags_1.htmlTags.post);
        // Replace all instances of the untagged string with the properly tagged string
        highlightHtml = highlightHtml.split(untaggedHighlight).join(taggedHighlight);
    });
    return highlightHtml;
}
exports.getHighlightHtml = getHighlightHtml;
