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
exports.usageProvider = void 0;
const SAVED_OBJECT_ID = 'search-telemetry';
function usageProvider(core) {
    const getTracker = (eventType) => {
        return async (duration) => {
            const repository = await core
                .getStartServices()
                .then(([coreStart]) => coreStart.savedObjects.createInternalRepository());
            let attributes;
            let doesSavedObjectExist = true;
            try {
                const response = await repository.get(SAVED_OBJECT_ID, SAVED_OBJECT_ID);
                attributes = response.attributes;
            }
            catch (e) {
                doesSavedObjectExist = false;
                attributes = {
                    successCount: 0,
                    errorCount: 0,
                    averageDuration: 0,
                };
            }
            attributes[eventType]++;
            // Only track the average duration for successful requests
            if (eventType === 'successCount') {
                attributes.averageDuration =
                    ((duration ?? 0) + (attributes.averageDuration ?? 0)) / (attributes.successCount ?? 1);
            }
            try {
                if (doesSavedObjectExist) {
                    await repository.update(SAVED_OBJECT_ID, SAVED_OBJECT_ID, attributes);
                }
                else {
                    await repository.create(SAVED_OBJECT_ID, attributes, { id: SAVED_OBJECT_ID });
                }
            }
            catch (e) {
                // Version conflict error, swallow
            }
        };
    };
    return {
        trackError: () => getTracker('errorCount')(),
        trackSuccess: getTracker('successCount'),
    };
}
exports.usageProvider = usageProvider;
