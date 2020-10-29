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
exports.CollectorSet = void 0;
const lodash_1 = require("lodash");
const collector_1 = require("./collector");
const usage_collector_1 = require("./usage_collector");
class CollectorSet {
    constructor({ logger, maximumWaitTimeForAllCollectorsInS, collectors = [] }) {
        this.makeStatsCollector = (options) => {
            return new collector_1.Collector(this.logger, options);
        };
        this.makeUsageCollector = (options) => {
            return new usage_collector_1.UsageCollector(this.logger, options);
        };
        /*
         * @param collector {Collector} collector object
         */
        this.registerCollector = (collector) => {
            // check instanceof
            if (!(collector instanceof collector_1.Collector)) {
                throw new Error('CollectorSet can only have Collector instances registered');
            }
            if (this.collectors.get(collector.type)) {
                throw new Error(`Usage collector's type "${collector.type}" is duplicated.`);
            }
            this.collectors.set(collector.type, collector);
            if (collector.init) {
                this.logger.debug(`Initializing ${collector.type} collector`);
                collector.init();
            }
        };
        this.getCollectorByType = (type) => {
            return [...this.collectors.values()].find((c) => c.type === type);
        };
        this.isUsageCollector = (x) => {
            return x instanceof usage_collector_1.UsageCollector;
        };
        this.areAllCollectorsReady = async (collectorSet = this) => {
            // Kept this for runtime validation in JS code.
            if (!(collectorSet instanceof CollectorSet)) {
                throw new Error(`areAllCollectorsReady method given bad collectorSet parameter: ` + typeof collectorSet);
            }
            const collectorTypesNotReady = (await Promise.all([...collectorSet.collectors.values()].map(async (collector) => {
                if (!(await collector.isReady())) {
                    return collector.type;
                }
            }))).filter((collectorType) => !!collectorType);
            const allReady = collectorTypesNotReady.length === 0;
            if (!allReady && this.maximumWaitTimeForAllCollectorsInS >= 0) {
                const nowTimestamp = +new Date();
                this._waitingForAllCollectorsTimestamp =
                    this._waitingForAllCollectorsTimestamp || nowTimestamp;
                const timeWaitedInMS = nowTimestamp - this._waitingForAllCollectorsTimestamp;
                const timeLeftInMS = this.maximumWaitTimeForAllCollectorsInS * 1000 - timeWaitedInMS;
                if (timeLeftInMS <= 0) {
                    this.logger.debug(`All collectors are not ready (waiting for ${collectorTypesNotReady.join(',')}) ` +
                        `but we have waited the required ` +
                        `${this.maximumWaitTimeForAllCollectorsInS}s and will return data from all collectors that are ready.`);
                    return true;
                }
                else {
                    this.logger.debug(`All collectors are not ready. Waiting for ${timeLeftInMS}ms longer.`);
                }
            }
            else {
                this._waitingForAllCollectorsTimestamp = undefined;
            }
            return allReady;
        };
        this.bulkFetch = async (callCluster, collectors = this.collectors) => {
            const responses = await Promise.all([...collectors.values()].map(async (collector) => {
                this.logger.debug(`Fetching data from ${collector.type} collector`);
                try {
                    return {
                        type: collector.type,
                        result: await collector.fetch(callCluster),
                    };
                }
                catch (err) {
                    this.logger.warn(err);
                    this.logger.warn(`Unable to fetch data from ${collector.type} collector`);
                }
            }));
            return responses.filter((response) => typeof response !== 'undefined');
        };
        /*
         * @return {new CollectorSet}
         */
        this.getFilteredCollectorSet = (filter) => {
            const filtered = [...this.collectors.values()].filter(filter);
            return this.makeCollectorSetFromArray(filtered);
        };
        this.bulkFetchUsage = async (callCluster) => {
            const usageCollectors = this.getFilteredCollectorSet((c) => c instanceof usage_collector_1.UsageCollector);
            return await this.bulkFetch(callCluster, usageCollectors.collectors);
        };
        // convert an array of fetched stats results into key/object
        this.toObject = (statsData = []) => {
            return statsData.reduce((accumulatedStats, { type, result }) => {
                return {
                    ...accumulatedStats,
                    [type]: result,
                };
            }, {});
        };
        // rename fields to use api conventions
        this.toApiFieldNames = (apiData) => {
            const getValueOrRecurse = (value) => {
                if (value == null || typeof value !== 'object') {
                    return value;
                }
                else {
                    return this.toApiFieldNames(value); // recurse
                }
            };
            // handle array and return early, or return a reduced object
            if (Array.isArray(apiData)) {
                return apiData.map(getValueOrRecurse);
            }
            return Object.keys(apiData).reduce((accum, field) => {
                const value = apiData[field];
                let newName = field;
                newName = lodash_1.snakeCase(newName);
                newName = newName.replace(/^(1|5|15)_m/, '$1m'); // os.load.15m, os.load.5m, os.load.1m
                newName = newName.replace('_in_bytes', '_bytes');
                newName = newName.replace('_in_millis', '_ms');
                return {
                    ...accum,
                    [newName]: getValueOrRecurse(value),
                };
            }, {});
        };
        // TODO: remove
        this.map = (mapFn) => {
            return [...this.collectors.values()].map(mapFn);
        };
        // TODO: remove
        this.some = (someFn) => {
            return [...this.collectors.values()].some(someFn);
        };
        this.makeCollectorSetFromArray = (collectors) => {
            return new CollectorSet({
                logger: this.logger,
                maximumWaitTimeForAllCollectorsInS: this.maximumWaitTimeForAllCollectorsInS,
                collectors,
            });
        };
        this.logger = logger;
        this.collectors = new Map(collectors.map((collector) => [collector.type, collector]));
        this.maximumWaitTimeForAllCollectorsInS = maximumWaitTimeForAllCollectorsInS || 60;
    }
}
exports.CollectorSet = CollectorSet;
