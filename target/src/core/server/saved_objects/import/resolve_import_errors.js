"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSavedObjectsImportErrors = void 0;
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
const collect_saved_objects_1 = require("./collect_saved_objects");
const create_objects_filter_1 = require("./create_objects_filter");
const extract_errors_1 = require("./extract_errors");
const split_overwrites_1 = require("./split_overwrites");
const validate_references_1 = require("./validate_references");
/**
 * Resolve and return saved object import errors.
 * See the {@link SavedObjectsResolveImportErrorsOptions | options} for more detailed informations.
 *
 * @public
 */
async function resolveSavedObjectsImportErrors({ readStream, objectLimit, retries, savedObjectsClient, supportedTypes, namespace, }) {
    let successCount = 0;
    let errorAccumulator = [];
    const filter = create_objects_filter_1.createObjectsFilter(retries);
    // Get the objects to resolve errors
    const { errors: collectorErrors, collectedObjects: objectsToResolve } = await collect_saved_objects_1.collectSavedObjects({
        readStream,
        objectLimit,
        filter,
        supportedTypes,
    });
    errorAccumulator = [...errorAccumulator, ...collectorErrors];
    // Create a map of references to replace for each object to avoid iterating through
    // retries for every object to resolve
    const retriesReferencesMap = new Map();
    for (const retry of retries) {
        const map = {};
        for (const { type, from, to } of retry.replaceReferences) {
            map[`${type}:${from}`] = to;
        }
        retriesReferencesMap.set(`${retry.type}:${retry.id}`, map);
    }
    // Replace references
    for (const savedObject of objectsToResolve) {
        const refMap = retriesReferencesMap.get(`${savedObject.type}:${savedObject.id}`);
        if (!refMap) {
            continue;
        }
        for (const reference of savedObject.references || []) {
            if (refMap[`${reference.type}:${reference.id}`]) {
                reference.id = refMap[`${reference.type}:${reference.id}`];
            }
        }
    }
    // Validate references
    const { filteredObjects, errors: validationErrors } = await validate_references_1.validateReferences(objectsToResolve, savedObjectsClient, namespace);
    errorAccumulator = [...errorAccumulator, ...validationErrors];
    // Bulk create in two batches, overwrites and non-overwrites
    const { objectsToOverwrite, objectsToNotOverwrite } = split_overwrites_1.splitOverwrites(filteredObjects, retries);
    if (objectsToOverwrite.length) {
        const bulkCreateResult = await savedObjectsClient.bulkCreate(objectsToOverwrite, {
            overwrite: true,
            namespace,
        });
        errorAccumulator = [
            ...errorAccumulator,
            ...extract_errors_1.extractErrors(bulkCreateResult.saved_objects, objectsToOverwrite),
        ];
        successCount += bulkCreateResult.saved_objects.filter((obj) => !obj.error).length;
    }
    if (objectsToNotOverwrite.length) {
        const bulkCreateResult = await savedObjectsClient.bulkCreate(objectsToNotOverwrite, {
            namespace,
        });
        errorAccumulator = [
            ...errorAccumulator,
            ...extract_errors_1.extractErrors(bulkCreateResult.saved_objects, objectsToNotOverwrite),
        ];
        successCount += bulkCreateResult.saved_objects.filter((obj) => !obj.error).length;
    }
    return {
        successCount,
        success: errorAccumulator.length === 0,
        ...(errorAccumulator.length ? { errors: errorAccumulator } : {}),
    };
}
exports.resolveSavedObjectsImportErrors = resolveSavedObjectsImportErrors;
