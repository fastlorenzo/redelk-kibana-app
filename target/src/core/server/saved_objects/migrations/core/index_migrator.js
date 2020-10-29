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
exports.IndexMigrator = void 0;
const tslib_1 = require("tslib");
const build_active_mappings_1 = require("./build_active_mappings");
const Index = tslib_1.__importStar(require("./elastic_index"));
const migrate_raw_docs_1 = require("./migrate_raw_docs");
const migration_context_1 = require("./migration_context");
const migration_coordinator_1 = require("./migration_coordinator");
/*
 * Core logic for migrating the mappings and documents in an index.
 */
class IndexMigrator {
    /**
     * Creates an instance of IndexMigrator.
     *
     * @param {MigrationOpts} opts
     */
    constructor(opts) {
        this.opts = opts;
    }
    /**
     * Migrates the index, or, if another Kibana instance appears to be running the migration,
     * waits for the migration to complete.
     *
     * @returns {Promise<MigrationResult>}
     */
    async migrate() {
        const context = await migration_context_1.migrationContext(this.opts);
        return migration_coordinator_1.coordinateMigration({
            log: context.log,
            pollInterval: context.pollInterval,
            async isMigrated() {
                return !(await requiresMigration(context));
            },
            async runMigration() {
                if (await requiresMigration(context)) {
                    return migrateIndex(context);
                }
                return { status: 'skipped' };
            },
        });
    }
}
exports.IndexMigrator = IndexMigrator;
/**
 * Determines what action the migration system needs to take (none, patch, migrate).
 */
async function requiresMigration(context) {
    const { callCluster, alias, documentMigrator, dest, log } = context;
    // Have all of our known migrations been run against the index?
    const hasMigrations = await Index.migrationsUpToDate(callCluster, alias, documentMigrator.migrationVersion);
    if (!hasMigrations) {
        return true;
    }
    // Is our index aliased?
    const refreshedSource = await Index.fetchInfo(callCluster, alias);
    if (!refreshedSource.aliases[alias]) {
        return true;
    }
    // Do the actual index mappings match our expectations?
    const diffResult = build_active_mappings_1.diffMappings(refreshedSource.mappings, dest.mappings);
    if (diffResult) {
        log.info(`Detected mapping change in "${diffResult.changedProp}"`);
        return true;
    }
    return false;
}
/**
 * Performs an index migration if the source index exists, otherwise
 * this simply creates the dest index with the proper mappings.
 */
async function migrateIndex(context) {
    const startTime = Date.now();
    const { callCluster, alias, source, dest, log } = context;
    await deleteIndexTemplates(context);
    log.info(`Creating index ${dest.indexName}.`);
    await Index.createIndex(callCluster, dest.indexName, dest.mappings);
    await migrateSourceToDest(context);
    log.info(`Pointing alias ${alias} to ${dest.indexName}.`);
    await Index.claimAlias(callCluster, dest.indexName, alias);
    const result = {
        status: 'migrated',
        destIndex: dest.indexName,
        sourceIndex: source.indexName,
        elapsedMs: Date.now() - startTime,
    };
    log.info(`Finished in ${result.elapsedMs}ms.`);
    return result;
}
/**
 * If the obsoleteIndexTemplatePattern option is specified, this will delete any index templates
 * that match it.
 */
async function deleteIndexTemplates({ callCluster, log, obsoleteIndexTemplatePattern }) {
    if (!obsoleteIndexTemplatePattern) {
        return;
    }
    const templates = await callCluster('cat.templates', {
        format: 'json',
        name: obsoleteIndexTemplatePattern,
    });
    if (!templates.length) {
        return;
    }
    const templateNames = templates.map((t) => t.name);
    log.info(`Removing index templates: ${templateNames}`);
    return Promise.all(templateNames.map((name) => callCluster('indices.deleteTemplate', { name })));
}
/**
 * Moves all docs from sourceIndex to destIndex, migrating each as necessary.
 * This moves documents from the concrete index, rather than the alias, to prevent
 * a situation where the alias moves out from under us as we're migrating docs.
 */
async function migrateSourceToDest(context) {
    const { callCluster, alias, dest, source, batchSize } = context;
    const { scrollDuration, documentMigrator, log, serializer } = context;
    if (!source.exists) {
        return;
    }
    if (!source.aliases[alias]) {
        log.info(`Reindexing ${alias} to ${source.indexName}`);
        await Index.convertToAlias(callCluster, source, alias, batchSize, context.convertToAliasScript);
    }
    const read = Index.reader(callCluster, source.indexName, { batchSize, scrollDuration });
    log.info(`Migrating ${source.indexName} saved objects to ${dest.indexName}`);
    while (true) {
        const docs = await read();
        if (!docs || !docs.length) {
            return;
        }
        log.debug(`Migrating saved objects ${docs.map((d) => d._id).join(', ')}`);
        await Index.write(callCluster, dest.indexName, await migrate_raw_docs_1.migrateRawDocs(serializer, documentMigrator.migrate, docs, log));
    }
}
