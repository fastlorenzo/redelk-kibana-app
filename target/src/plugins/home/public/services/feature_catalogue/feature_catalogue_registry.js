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
exports.FeatureCatalogueRegistry = exports.FeatureCatalogueCategory = void 0;
/** @public */
var FeatureCatalogueCategory;
(function (FeatureCatalogueCategory) {
    FeatureCatalogueCategory["ADMIN"] = "admin";
    FeatureCatalogueCategory["DATA"] = "data";
    FeatureCatalogueCategory["OTHER"] = "other";
})(FeatureCatalogueCategory = exports.FeatureCatalogueCategory || (exports.FeatureCatalogueCategory = {}));
class FeatureCatalogueRegistry {
    constructor() {
        this.capabilities = null;
        this.features = new Map();
    }
    setup() {
        return {
            register: (feature) => {
                if (this.features.has(feature.id)) {
                    throw new Error(`Feature with id [${feature.id}] has already been registered. Use a unique id.`);
                }
                this.features.set(feature.id, feature);
            },
        };
    }
    start({ capabilities }) {
        this.capabilities = capabilities;
    }
    get() {
        if (this.capabilities === null) {
            throw new Error('Catalogue entries are only available after start phase');
        }
        const capabilities = this.capabilities;
        return [...this.features.values()]
            .filter((entry) => capabilities.catalogue[entry.id] !== false)
            .sort(compareByKey('title'));
    }
}
exports.FeatureCatalogueRegistry = FeatureCatalogueRegistry;
const compareByKey = (key) => (left, right) => {
    if (left[key] < right[key]) {
        return -1;
    }
    else if (left[key] > right[key]) {
        return 1;
    }
    else {
        return 0;
    }
};
