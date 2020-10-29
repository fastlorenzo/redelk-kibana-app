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
exports.DocViewsRegistry = void 0;
const doc_views_helpers_1 = require("./doc_views_helpers");
class DocViewsRegistry {
    constructor() {
        this.docViews = [];
        this.angularInjectorGetter = null;
        this.setAngularInjectorGetter = (injectorGetter) => {
            this.angularInjectorGetter = injectorGetter;
        };
    }
    /**
     * Extends and adds the given doc view to the registry array
     */
    addDocView(docViewRaw) {
        const docView = typeof docViewRaw === 'function' ? docViewRaw() : docViewRaw;
        if (docView.directive) {
            // convert angular directive to render function for backwards compatibility
            docView.render = doc_views_helpers_1.convertDirectiveToRenderFn(docView.directive, () => {
                if (!this.angularInjectorGetter) {
                    throw new Error('Angular was not initialized');
                }
                return this.angularInjectorGetter();
            });
        }
        if (typeof docView.shouldShow !== 'function') {
            docView.shouldShow = () => true;
        }
        this.docViews.push(docView);
    }
    /**
     * Returns a sorted array of doc_views for rendering tabs
     */
    getDocViewsSorted(hit) {
        return this.docViews
            .filter((docView) => docView.shouldShow(hit))
            .sort((a, b) => (Number(a.order) > Number(b.order) ? 1 : -1));
    }
}
exports.DocViewsRegistry = DocViewsRegistry;
