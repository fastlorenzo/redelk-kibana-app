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
exports.SavedObjectTypeRegistry = void 0;
const utils_1 = require("../../utils");
/**
 * Registry holding information about all the registered {@link SavedObjectsType | saved object types}.
 *
 * @public
 */
class SavedObjectTypeRegistry {
    constructor() {
        this.types = new Map();
    }
    /**
     * Register a {@link SavedObjectsType | type} inside the registry.
     * A type can only be registered once. subsequent calls with the same type name will throw an error.
     */
    registerType(type) {
        if (this.types.has(type.name)) {
            throw new Error(`Type '${type.name}' is already registered`);
        }
        this.types.set(type.name, utils_1.deepFreeze(type));
    }
    /**
     * Return the {@link SavedObjectsType | type} definition for given type name.
     */
    getType(type) {
        return this.types.get(type);
    }
    /**
     * Returns all visible {@link SavedObjectsType | types}.
     *
     * A visible type is a type that doesn't explicitly define `hidden=true` during registration.
     */
    getVisibleTypes() {
        return [...this.types.values()].filter((type) => !this.isHidden(type.name));
    }
    /**
     * Return all {@link SavedObjectsType | types} currently registered, including the hidden ones.
     *
     * To only get the visible types (which is the most common use case), use `getVisibleTypes` instead.
     */
    getAllTypes() {
        return [...this.types.values()];
    }
    /**
     * Return all {@link SavedObjectsType | types} currently registered that are importable/exportable.
     */
    getImportableAndExportableTypes() {
        return this.getAllTypes().filter((type) => this.isImportableAndExportable(type.name));
    }
    /**
     * Returns whether the type is namespace-agnostic (global);
     * resolves to `false` if the type is not registered
     */
    isNamespaceAgnostic(type) {
        return this.types.get(type)?.namespaceType === 'agnostic';
    }
    /**
     * Returns whether the type is single-namespace (isolated);
     * resolves to `true` if the type is not registered
     */
    isSingleNamespace(type) {
        // in the case we somehow registered a type with an invalid `namespaceType`, treat it as single-namespace
        return !this.isNamespaceAgnostic(type) && !this.isMultiNamespace(type);
    }
    /**
     * Returns whether the type is multi-namespace (shareable);
     * resolves to `false` if the type is not registered
     */
    isMultiNamespace(type) {
        return this.types.get(type)?.namespaceType === 'multiple';
    }
    /**
     * Returns the `hidden` property for given type, or `false` if
     * the type is not registered.
     */
    isHidden(type) {
        return this.types.get(type)?.hidden ?? false;
    }
    /**
     * Returns the `indexPattern` property for given type, or `undefined` if
     * the type is not registered.
     */
    getIndex(type) {
        return this.types.get(type)?.indexPattern;
    }
    /**
     * Returns the `management.importableAndExportable` property for given type, or
     * `false` if the type is not registered or does not define a management section.
     */
    isImportableAndExportable(type) {
        return this.types.get(type)?.management?.importableAndExportable ?? false;
    }
}
exports.SavedObjectTypeRegistry = SavedObjectTypeRegistry;
