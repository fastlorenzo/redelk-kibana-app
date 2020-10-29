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
exports.registerRoutes = void 0;
const get_1 = require("./get");
const create_1 = require("./create");
const delete_1 = require("./delete");
const find_1 = require("./find");
const update_1 = require("./update");
const bulk_get_1 = require("./bulk_get");
const bulk_create_1 = require("./bulk_create");
const bulk_update_1 = require("./bulk_update");
const log_legacy_import_1 = require("./log_legacy_import");
const export_1 = require("./export");
const import_1 = require("./import");
const resolve_import_errors_1 = require("./resolve_import_errors");
const migrate_1 = require("./migrate");
function registerRoutes({ http, logger, config, migratorPromise, }) {
    const router = http.createRouter('/api/saved_objects/');
    get_1.registerGetRoute(router);
    create_1.registerCreateRoute(router);
    delete_1.registerDeleteRoute(router);
    find_1.registerFindRoute(router);
    update_1.registerUpdateRoute(router);
    bulk_get_1.registerBulkGetRoute(router);
    bulk_create_1.registerBulkCreateRoute(router);
    bulk_update_1.registerBulkUpdateRoute(router);
    log_legacy_import_1.registerLogLegacyImportRoute(router, logger);
    export_1.registerExportRoute(router, config);
    import_1.registerImportRoute(router, config);
    resolve_import_errors_1.registerResolveImportErrorsRoute(router, config);
    const internalRouter = http.createRouter('/internal/saved_objects/');
    migrate_1.registerMigrateRoute(internalRouter, migratorPromise);
}
exports.registerRoutes = registerRoutes;
