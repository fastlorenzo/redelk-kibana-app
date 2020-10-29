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
exports.ConfigService = void 0;
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_1 = require("./config");
const deprecation_1 = require("./deprecation");
const config_2 = require("../legacy/config");
/** @internal */
class ConfigService {
    constructor(rawConfigProvider, env, logger) {
        this.rawConfigProvider = rawConfigProvider;
        this.env = env;
        /**
         * Whenever a config if read at a path, we mark that path as 'handled'. We can
         * then list all unhandled config paths when the startup process is completed.
         */
        this.handledPaths = [];
        this.schemas = new Map();
        this.deprecations = new rxjs_1.BehaviorSubject([]);
        this.log = logger.get('config');
        this.deprecationLog = logger.get('config', 'deprecation');
        this.config$ = rxjs_1.combineLatest([this.rawConfigProvider.getConfig$(), this.deprecations]).pipe(operators_1.map(([rawConfig, deprecations]) => {
            const migrated = deprecation_1.applyDeprecations(rawConfig, deprecations);
            return new config_2.LegacyObjectToConfigAdapter(migrated);
        }), operators_1.shareReplay(1));
    }
    /**
     * Set config schema for a path and performs its validation
     */
    async setSchema(path, schema) {
        const namespace = pathToString(path);
        if (this.schemas.has(namespace)) {
            throw new Error(`Validation schema for [${path}] was already registered.`);
        }
        this.schemas.set(namespace, schema);
        this.markAsHandled(path);
    }
    /**
     * Register a {@link ConfigDeprecationProvider} to be used when validating and migrating the configuration
     */
    addDeprecationProvider(path, provider) {
        const flatPath = pathToString(path);
        this.deprecations.next([
            ...this.deprecations.value,
            ...provider(deprecation_1.configDeprecationFactory).map((deprecation) => ({
                deprecation,
                path: flatPath,
            })),
        ]);
    }
    /**
     * Validate the whole configuration and log the deprecation warnings.
     *
     * This must be done after every schemas and deprecation providers have been registered.
     */
    async validate() {
        const namespaces = [...this.schemas.keys()];
        for (let i = 0; i < namespaces.length; i++) {
            await this.validateConfigAtPath(namespaces[i]).pipe(operators_1.first()).toPromise();
        }
        await this.logDeprecation();
    }
    /**
     * Returns the full config object observable. This is not intended for
     * "normal use", but for features that _need_ access to the full object.
     */
    getConfig$() {
        return this.config$;
    }
    /**
     * Reads the subset of the config at the specified `path` and validates it
     * against the static `schema` on the given `ConfigClass`.
     *
     * @param path - The path to the desired subset of the config.
     */
    atPath(path) {
        return this.validateConfigAtPath(path);
    }
    /**
     * Same as `atPath`, but returns `undefined` if there is no config at the
     * specified path.
     *
     * {@link ConfigService.atPath}
     */
    optionalAtPath(path) {
        return this.getDistinctConfig(path).pipe(operators_1.map((config) => {
            if (config === undefined)
                return undefined;
            return this.validateAtPath(path, config);
        }));
    }
    async isEnabledAtPath(path) {
        const namespace = pathToString(path);
        const validatedConfig = this.schemas.has(namespace)
            ? await this.atPath(path).pipe(operators_1.first()).toPromise()
            : undefined;
        const enabledPath = createPluginEnabledPath(path);
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        // if plugin hasn't got a config schema, we try to read "enabled" directly
        const isEnabled = validatedConfig && validatedConfig.enabled !== undefined
            ? validatedConfig.enabled
            : config.get(enabledPath);
        // not declared. consider that plugin is enabled by default
        if (isEnabled === undefined) {
            return true;
        }
        if (isEnabled === false) {
            // If the plugin is _not_ enabled, we mark the entire plugin path as
            // handled, as it's expected that it won't be used.
            this.markAsHandled(path);
            return false;
        }
        // If plugin enabled we mark the enabled path as handled, as we for example
        // can have plugins that don't have _any_ config except for this field, and
        // therefore have no reason to try to get the config.
        this.markAsHandled(enabledPath);
        return true;
    }
    async getUnusedPaths() {
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const handledPaths = this.handledPaths.map(pathToString);
        return config.getFlattenedPaths().filter((path) => !isPathHandled(path, handledPaths));
    }
    async getUsedPaths() {
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const handledPaths = this.handledPaths.map(pathToString);
        return config.getFlattenedPaths().filter((path) => isPathHandled(path, handledPaths));
    }
    async logDeprecation() {
        const rawConfig = await this.rawConfigProvider.getConfig$().pipe(operators_1.take(1)).toPromise();
        const deprecations = await this.deprecations.pipe(operators_1.take(1)).toPromise();
        const deprecationMessages = [];
        const logger = (msg) => deprecationMessages.push(msg);
        deprecation_1.applyDeprecations(rawConfig, deprecations, logger);
        deprecationMessages.forEach((msg) => {
            this.deprecationLog.warn(msg);
        });
    }
    validateAtPath(path, config) {
        const namespace = pathToString(path);
        const schema = this.schemas.get(namespace);
        if (!schema) {
            throw new Error(`No validation schema has been defined for [${namespace}]`);
        }
        return schema.validate(config, {
            dev: this.env.mode.dev,
            prod: this.env.mode.prod,
            ...this.env.packageInfo,
        }, `config validation of [${namespace}]`);
    }
    validateConfigAtPath(path) {
        return this.getDistinctConfig(path).pipe(operators_1.map((config) => this.validateAtPath(path, config)));
    }
    getDistinctConfig(path) {
        this.markAsHandled(path);
        return this.config$.pipe(operators_1.map((config) => config.get(path)), operators_1.distinctUntilChanged(lodash_1.isEqual));
    }
    markAsHandled(path) {
        this.log.debug(`Marking config path as handled: ${path}`);
        this.handledPaths.push(path);
    }
}
exports.ConfigService = ConfigService;
const createPluginEnabledPath = (configPath) => {
    if (Array.isArray(configPath)) {
        return configPath.concat('enabled');
    }
    return `${configPath}.enabled`;
};
const pathToString = (path) => (Array.isArray(path) ? path.join('.') : path);
/**
 * A path is considered 'handled' if it is a subset of any of the already
 * handled paths.
 */
const isPathHandled = (path, handledPaths) => handledPaths.some((handledPath) => config_1.hasConfigPathIntersection(path, handledPath));
