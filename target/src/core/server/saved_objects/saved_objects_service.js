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
exports.SavedObjectsService = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const _1 = require("./");
const migrations_1 = require("./migrations");
const legacy_1 = require("../elasticsearch/legacy");
const saved_objects_config_1 = require("./saved_objects_config");
const repository_1 = require("./service/lib/repository");
const utils_1 = require("./utils");
const saved_objects_type_registry_1 = require("./saved_objects_type_registry");
const serialization_1 = require("./serialization");
const routes_1 = require("./routes");
const status_1 = require("./status");
class SavedObjectsService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.clientFactoryWrappers = [];
        this.migrator$ = new rxjs_1.Subject();
        this.typeRegistry = new saved_objects_type_registry_1.SavedObjectTypeRegistry();
        this.validations = {};
        this.started = false;
        this.logger = coreContext.logger.get('savedobjects-service');
    }
    async setup(setupDeps) {
        this.logger.debug('Setting up SavedObjects service');
        this.setupDeps = setupDeps;
        const legacyTypes = utils_1.convertLegacyTypes(setupDeps.legacyPlugins.uiExports, setupDeps.legacyPlugins.pluginExtendedConfig);
        legacyTypes.forEach((type) => this.typeRegistry.registerType(type));
        this.validations = setupDeps.legacyPlugins.uiExports.savedObjectValidations || {};
        const savedObjectsConfig = await this.coreContext.configService
            .atPath('savedObjects')
            .pipe(operators_1.first())
            .toPromise();
        const savedObjectsMigrationConfig = await this.coreContext.configService
            .atPath('migrations')
            .pipe(operators_1.first())
            .toPromise();
        this.config = new saved_objects_config_1.SavedObjectConfig(savedObjectsConfig, savedObjectsMigrationConfig);
        routes_1.registerRoutes({
            http: setupDeps.http,
            logger: this.logger,
            config: this.config,
            migratorPromise: this.migrator$.pipe(operators_1.first()).toPromise(),
        });
        return {
            status$: status_1.calculateStatus$(this.migrator$.pipe(operators_1.switchMap((migrator) => migrator.getStatus$())), setupDeps.elasticsearch.status$),
            setClientFactoryProvider: (provider) => {
                if (this.started) {
                    throw new Error('cannot call `setClientFactoryProvider` after service startup.');
                }
                if (this.clientFactoryProvider) {
                    throw new Error('custom client factory is already set, and can only be set once');
                }
                this.clientFactoryProvider = provider;
            },
            addClientWrapper: (priority, id, factory) => {
                if (this.started) {
                    throw new Error('cannot call `addClientWrapper` after service startup.');
                }
                this.clientFactoryWrappers.push({
                    priority,
                    id,
                    factory,
                });
            },
            registerType: (type) => {
                if (this.started) {
                    throw new Error('cannot call `registerType` after service startup.');
                }
                this.typeRegistry.registerType(type);
            },
            getImportExportObjectLimit: () => this.config.maxImportExportSize,
        };
    }
    async start({ elasticsearch, pluginsInitialized = true }, migrationsRetryDelay) {
        if (!this.setupDeps || !this.config) {
            throw new Error('#setup() needs to be run first');
        }
        this.logger.debug('Starting SavedObjects service');
        const kibanaConfig = await this.coreContext.configService
            .atPath('kibana')
            .pipe(operators_1.first())
            .toPromise();
        const client = elasticsearch.legacy.client;
        const migrator = this.createMigrator(kibanaConfig, this.config.migration, client, migrationsRetryDelay);
        this.migrator$.next(migrator);
        /**
         * Note: We want to ensure that migrations have completed before
         * continuing with further Core start steps that might use SavedObjects
         * such as running the legacy server, legacy plugins and allowing incoming
         * HTTP requests.
         *
         * However, our build system optimize step and some tests depend on the
         * HTTP server running without an Elasticsearch server being available.
         * So, when the `migrations.skip` is true, we skip migrations altogether.
         *
         * We also cannot safely run migrations if plugins are not initialized since
         * not plugin migrations won't be registered.
         */
        const skipMigrations = this.config.migration.skip || !pluginsInitialized;
        if (skipMigrations) {
            this.logger.warn('Skipping Saved Object migrations on startup. Note: Individual documents will still be migrated when read or written.');
        }
        else {
            this.logger.info('Waiting until all Elasticsearch nodes are compatible with Kibana before starting saved objects migrations...');
            // TODO: Move to Status Service https://github.com/elastic/kibana/issues/41983
            this.setupDeps.elasticsearch.esNodesCompatibility$.subscribe(({ isCompatible, message }) => {
                if (!isCompatible && message) {
                    this.logger.error(message);
                }
            });
            await this.setupDeps.elasticsearch.esNodesCompatibility$.pipe(operators_1.filter((nodes) => nodes.isCompatible), operators_1.take(1)).toPromise();
            this.logger.info('Starting saved objects migrations');
            await migrator.runMigrations();
        }
        const createRepository = (callCluster, includedHiddenTypes = []) => {
            return repository_1.SavedObjectsRepository.createRepository(migrator, this.typeRegistry, kibanaConfig.index, callCluster, includedHiddenTypes);
        };
        const repositoryFactory = {
            createInternalRepository: (includedHiddenTypes) => createRepository(client.callAsInternalUser, includedHiddenTypes),
            createScopedRepository: (req, includedHiddenTypes) => createRepository(client.asScoped(req).callAsCurrentUser, includedHiddenTypes),
        };
        const clientProvider = new _1.SavedObjectsClientProvider({
            defaultClientFactory({ request, includedHiddenTypes }) {
                const repository = repositoryFactory.createScopedRepository(request, includedHiddenTypes);
                return new _1.SavedObjectsClient(repository);
            },
            typeRegistry: this.typeRegistry,
        });
        if (this.clientFactoryProvider) {
            const clientFactory = this.clientFactoryProvider(repositoryFactory);
            clientProvider.setClientFactory(clientFactory);
        }
        this.clientFactoryWrappers.forEach(({ id, factory, priority }) => {
            clientProvider.addClientWrapperFactory(priority, id, factory);
        });
        this.started = true;
        return {
            migrator,
            clientProvider,
            getScopedClient: clientProvider.getClient.bind(clientProvider),
            createScopedRepository: repositoryFactory.createScopedRepository,
            createInternalRepository: repositoryFactory.createInternalRepository,
            createSerializer: () => new serialization_1.SavedObjectsSerializer(this.typeRegistry),
            getTypeRegistry: () => this.typeRegistry,
        };
    }
    async stop() { }
    createMigrator(kibanaConfig, savedObjectsConfig, esClient, migrationsRetryDelay) {
        return new migrations_1.KibanaMigrator({
            typeRegistry: this.typeRegistry,
            logger: this.logger,
            kibanaVersion: this.coreContext.env.packageInfo.version,
            savedObjectsConfig,
            savedObjectValidations: this.validations,
            kibanaConfig,
            callCluster: legacy_1.migrationsRetryCallCluster(esClient.callAsInternalUser, this.logger, migrationsRetryDelay),
        });
    }
}
exports.SavedObjectsService = SavedObjectsService;
