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
exports.ExpressionRendererRegistry = void 0;
const expression_renderer_1 = require("./expression_renderer");
class ExpressionRendererRegistry {
    constructor() {
        this.renderers = new Map();
    }
    register(definition) {
        if (typeof definition === 'function')
            definition = definition();
        const renderer = new expression_renderer_1.ExpressionRenderer(definition);
        this.renderers.set(renderer.name, renderer);
    }
    get(id) {
        return this.renderers.get(id) || null;
    }
    toJS() {
        return this.toArray().reduce((acc, renderer) => ({
            ...acc,
            [renderer.name]: renderer,
        }), {});
    }
    toArray() {
        return [...this.renderers.values()];
    }
}
exports.ExpressionRendererRegistry = ExpressionRendererRegistry;
