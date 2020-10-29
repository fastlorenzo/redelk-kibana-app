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
exports.exportSavedObjectsToStream = void 0;
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const streams_1 = require("../../../../legacy/utils/streams");
const inject_nested_depdendencies_1 = require("./inject_nested_depdendencies");
const sort_objects_1 = require("./sort_objects");
async function fetchObjectsToExport({ objects, types, search, exportSizeLimit, savedObjectsClient, namespace, }) {
    if ((types?.length ?? 0) > 0 && (objects?.length ?? 0) > 0) {
        throw boom_1.default.badRequest(`Can't specify both "types" and "objects" properties when exporting`);
    }
    if (objects && objects.length > 0) {
        if (objects.length > exportSizeLimit) {
            throw boom_1.default.badRequest(`Can't export more than ${exportSizeLimit} objects`);
        }
        if (typeof search === 'string') {
            throw boom_1.default.badRequest(`Can't specify both "search" and "objects" properties when exporting`);
        }
        const bulkGetResult = await savedObjectsClient.bulkGet(objects, { namespace });
        const erroredObjects = bulkGetResult.saved_objects.filter((obj) => !!obj.error);
        if (erroredObjects.length) {
            const err = boom_1.default.badRequest();
            err.output.payload.attributes = {
                objects: erroredObjects,
            };
            throw err;
        }
        return bulkGetResult.saved_objects;
    }
    else if (types && types.length > 0) {
        const findResponse = await savedObjectsClient.find({
            type: types,
            search,
            perPage: exportSizeLimit,
            namespaces: namespace ? [namespace] : undefined,
        });
        if (findResponse.total > exportSizeLimit) {
            throw boom_1.default.badRequest(`Can't export more than ${exportSizeLimit} objects`);
        }
        // sorts server-side by _id, since it's only available in fielddata
        return (findResponse.saved_objects
            // exclude the find-specific `score` property from the exported objects
            .map(({ score, ...obj }) => obj)
            .sort((a, b) => (a.id > b.id ? 1 : -1)));
    }
    else {
        throw boom_1.default.badRequest('Either `type` or `objects` are required.');
    }
}
/**
 * Generates sorted saved object stream to be used for export.
 * See the {@link SavedObjectsExportOptions | options} for more detailed information.
 *
 * @public
 */
async function exportSavedObjectsToStream({ types, objects, search, savedObjectsClient, exportSizeLimit, includeReferencesDeep = false, excludeExportDetails = false, namespace, }) {
    const rootObjects = await fetchObjectsToExport({
        types,
        objects,
        search,
        savedObjectsClient,
        exportSizeLimit,
        namespace,
    });
    let exportedObjects = [];
    let missingReferences = [];
    if (includeReferencesDeep) {
        const fetchResult = await inject_nested_depdendencies_1.fetchNestedDependencies(rootObjects, savedObjectsClient, namespace);
        exportedObjects = sort_objects_1.sortObjects(fetchResult.objects);
        missingReferences = fetchResult.missingRefs;
    }
    else {
        exportedObjects = sort_objects_1.sortObjects(rootObjects);
    }
    // redact attributes that should not be exported
    const redactedObjects = exportedObjects.map(({ namespaces, ...object }) => object);
    const exportDetails = {
        exportedCount: exportedObjects.length,
        missingRefCount: missingReferences.length,
        missingReferences,
    };
    return streams_1.createListStream([...redactedObjects, ...(excludeExportDetails ? [] : [exportDetails])]);
}
exports.exportSavedObjectsToStream = exportSavedObjectsToStream;
