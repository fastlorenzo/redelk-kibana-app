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
exports.SimpleSavedObject = void 0;
const safer_lodash_set_1 = require("@elastic/safer-lodash-set");
const lodash_1 = require("lodash");
/**
 * This class is a very simple wrapper for SavedObjects loaded from the server
 * with the {@link SavedObjectsClient}.
 *
 * It provides basic functionality for creating/saving/deleting saved objects,
 * but doesn't include any type-specific implementations.
 *
 * @public
 */
class SimpleSavedObject {
    constructor(client, { id, type, version, attributes, error, references, migrationVersion }) {
        this.client = client;
        this.id = id;
        this.type = type;
        this.attributes = attributes || {};
        this.references = references || [];
        this._version = version;
        this.migrationVersion = migrationVersion;
        if (error) {
            this.error = error;
        }
    }
    get(key) {
        return lodash_1.get(this.attributes, key);
    }
    set(key, value) {
        return safer_lodash_set_1.set(this.attributes, key, value);
    }
    has(key) {
        return lodash_1.has(this.attributes, key);
    }
    save() {
        if (this.id) {
            return this.client.update(this.type, this.id, this.attributes, {
                migrationVersion: this.migrationVersion,
                references: this.references,
            });
        }
        else {
            return this.client.create(this.type, this.attributes, {
                migrationVersion: this.migrationVersion,
                references: this.references,
            });
        }
    }
    delete() {
        return this.client.delete(this.type, this.id);
    }
}
exports.SimpleSavedObject = SimpleSavedObject;
