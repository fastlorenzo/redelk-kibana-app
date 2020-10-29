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
exports.convertTypesToLegacySchema = exports.convertLegacyTypes = void 0;
/**
 * Converts the legacy savedObjects mappings, schema, and migrations
 * to actual {@link SavedObjectsType | saved object types}
 */
exports.convertLegacyTypes = ({ savedObjectMappings = [], savedObjectMigrations = {}, savedObjectSchemas = {}, savedObjectsManagement = {}, }, legacyConfig) => {
    return savedObjectMappings.reduce((types, { properties }) => {
        return [
            ...types,
            ...Object.entries(properties).map(([type, mappings]) => {
                const schema = savedObjectSchemas[type];
                const migrations = savedObjectMigrations[type];
                const management = savedObjectsManagement[type];
                const namespaceType = (schema?.isNamespaceAgnostic
                    ? 'agnostic'
                    : schema?.multiNamespace
                        ? 'multiple'
                        : 'single');
                return {
                    name: type,
                    hidden: schema?.hidden ?? false,
                    namespaceType,
                    mappings,
                    indexPattern: typeof schema?.indexPattern === 'function'
                        ? schema.indexPattern(legacyConfig)
                        : schema?.indexPattern,
                    convertToAliasScript: schema?.convertToAliasScript,
                    migrations: convertLegacyMigrations(migrations ?? {}),
                    management: management ? convertLegacyTypeManagement(management) : undefined,
                };
            }),
        ];
    }, []);
};
/**
 * Convert {@link SavedObjectsType | saved object types} to the legacy {@link SavedObjectsSchemaDefinition | schema} format
 */
exports.convertTypesToLegacySchema = (types) => {
    return types.reduce((schema, type) => {
        return {
            ...schema,
            [type.name]: {
                isNamespaceAgnostic: type.namespaceType === 'agnostic',
                multiNamespace: type.namespaceType === 'multiple',
                hidden: type.hidden,
                indexPattern: type.indexPattern,
                convertToAliasScript: type.convertToAliasScript,
            },
        };
    }, {});
};
const convertLegacyMigrations = (legacyMigrations) => {
    return Object.entries(legacyMigrations).reduce((migrated, [version, migrationFn]) => {
        return {
            ...migrated,
            [version]: (doc, context) => migrationFn(doc, context.log),
        };
    }, {});
};
const convertLegacyTypeManagement = (legacyTypeManagement) => {
    return {
        importableAndExportable: legacyTypeManagement.isImportableAndExportable,
        defaultSearchField: legacyTypeManagement.defaultSearchField,
        icon: legacyTypeManagement.icon,
        getTitle: legacyTypeManagement.getTitle,
        getEditUrl: legacyTypeManagement.getEditUrl,
        getInAppUrl: legacyTypeManagement.getInAppUrl,
    };
};
