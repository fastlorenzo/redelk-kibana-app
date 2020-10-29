"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSetRoute = void 0;
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
const config_schema_1 = require("@kbn/config-schema");
const saved_objects_1 = require("../../saved_objects");
const ui_settings_errors_1 = require("../ui_settings_errors");
const validate = {
    params: config_schema_1.schema.object({
        key: config_schema_1.schema.string(),
    }),
    body: config_schema_1.schema.object({
        value: config_schema_1.schema.any(),
    }),
};
function registerSetRoute(router) {
    router.post({ path: '/api/kibana/settings/{key}', validate }, async (context, request, response) => {
        try {
            const uiSettingsClient = context.core.uiSettings.client;
            const { key } = request.params;
            const { value } = request.body;
            await uiSettingsClient.set(key, value);
            return response.ok({
                body: {
                    settings: await uiSettingsClient.getUserProvided(),
                },
            });
        }
        catch (error) {
            if (saved_objects_1.SavedObjectsErrorHelpers.isSavedObjectsClientError(error)) {
                return response.customError({
                    body: error,
                    statusCode: error.output.statusCode,
                });
            }
            if (error instanceof ui_settings_errors_1.CannotOverrideError || error instanceof config_schema_1.ValidationError) {
                return response.badRequest({ body: error });
            }
            throw error;
        }
    });
}
exports.registerSetRoute = registerSetRoute;
