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
exports.getHighlightRequest = void 0;
const highlight_tags_1 = require("./highlight_tags");
const FRAGMENT_SIZE = Math.pow(2, 31) - 1; // Max allowed value for fragment_size (limit of a java int)
function getHighlightRequest(query, shouldHighlight) {
    if (!shouldHighlight)
        return;
    return {
        pre_tags: [highlight_tags_1.highlightTags.pre],
        post_tags: [highlight_tags_1.highlightTags.post],
        fields: {
            '*': {},
        },
        fragment_size: FRAGMENT_SIZE,
    };
}
exports.getHighlightRequest = getHighlightRequest;
