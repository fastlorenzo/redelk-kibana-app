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
exports.createSavedObjectClass = void 0;
const build_saved_object_1 = require("./helpers/build_saved_object");
function createSavedObjectClass(services) {
    /**
     * The SavedObject class is a base class for saved objects loaded from the server and
     * provides additional functionality besides loading/saving/deleting/etc.
     *
     * It is overloaded and configured to provide type-aware functionality.
     * To just retrieve the attributes of saved objects, it is recommended to use SavedObjectLoader
     * which returns instances of SimpleSavedObject which don't introduce additional type-specific complexity.
     * @param {*} config
     */
    class SavedObjectClass {
        constructor(config = {}) {
            // @ts-ignore
            const self = this;
            build_saved_object_1.buildSavedObject(self, config, services);
        }
    }
    return SavedObjectClass;
}
exports.createSavedObjectClass = createSavedObjectClass;
