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
exports.AggConfigs = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const agg_config_1 = require("./agg_config");
const agg_groups_1 = require("./agg_groups");
function removeParentAggs(obj) {
    for (const prop in obj) {
        if (prop === 'parentAggs')
            delete obj[prop];
        else if (typeof obj[prop] === 'object')
            removeParentAggs(obj[prop]);
    }
}
function parseParentAggs(dslLvlCursor, dsl) {
    if (dsl.parentAggs) {
        lodash_1.default.each(dsl.parentAggs, (agg, key) => {
            dslLvlCursor[key] = agg;
            parseParentAggs(dslLvlCursor, agg);
        });
    }
}
class AggConfigs {
    constructor(indexPattern, configStates = [], opts) {
        this.createAggConfig = (params, { addToAggConfigs = true } = {}) => {
            const { type } = params;
            let aggConfig;
            if (params instanceof agg_config_1.AggConfig) {
                aggConfig = params;
                params.parent = this;
            }
            else {
                aggConfig = new agg_config_1.AggConfig(this, {
                    ...params,
                    type: typeof type === 'string' ? this.typesRegistry.get(type) : type,
                });
            }
            if (addToAggConfigs) {
                this.aggs.push(aggConfig);
            }
            return aggConfig;
        };
        this.typesRegistry = opts.typesRegistry;
        configStates = agg_config_1.AggConfig.ensureIds(configStates);
        this.aggs = [];
        this.indexPattern = indexPattern;
        configStates.forEach((params) => this.createAggConfig(params));
    }
    setTimeRange(timeRange) {
        this.timeRange = timeRange;
        const updateAggTimeRange = (agg) => {
            lodash_1.default.each(agg.params, (param) => {
                if (param instanceof agg_config_1.AggConfig) {
                    updateAggTimeRange(param);
                }
            });
            if (lodash_1.default.get(agg, 'type.name') === 'date_histogram') {
                agg.params.timeRange = timeRange;
            }
        };
        this.aggs.forEach(updateAggTimeRange);
    }
    // clone method will reuse existing AggConfig in the list (will not create new instances)
    clone({ enabledOnly = true } = {}) {
        const filterAggs = (agg) => {
            if (!enabledOnly)
                return true;
            return agg.enabled;
        };
        const aggConfigs = new AggConfigs(this.indexPattern, this.aggs.filter(filterAggs), {
            typesRegistry: this.typesRegistry,
        });
        return aggConfigs;
    }
    /**
     * Data-by-data comparison of this Aggregation
     * Ignores the non-array indexes
     * @param aggConfigs an AggConfigs instance
     */
    jsonDataEquals(aggConfigs) {
        if (aggConfigs.length !== this.aggs.length) {
            return false;
        }
        for (let i = 0; i < this.aggs.length; i += 1) {
            if (!lodash_1.default.isEqual(aggConfigs[i].toJSON(), this.aggs[i].toJSON())) {
                return false;
            }
        }
        return true;
    }
    toDsl(hierarchical = false) {
        const dslTopLvl = {};
        let dslLvlCursor;
        let nestedMetrics;
        if (hierarchical) {
            // collect all metrics, and filter out the ones that we won't be copying
            nestedMetrics = this.aggs
                .filter(function (agg) {
                return agg.type.type === 'metrics' && agg.type.name !== 'count';
            })
                .map((agg) => {
                return {
                    config: agg,
                    dsl: agg.toDsl(this),
                };
            });
        }
        this.getRequestAggs()
            .filter((config) => !config.type.hasNoDsl)
            .forEach((config, i, list) => {
            if (!dslLvlCursor) {
                // start at the top level
                dslLvlCursor = dslTopLvl;
            }
            else {
                const prevConfig = list[i - 1];
                const prevDsl = dslLvlCursor[prevConfig.id];
                // advance the cursor and nest under the previous agg, or
                // put it on the same level if the previous agg doesn't accept
                // sub aggs
                dslLvlCursor = prevDsl.aggs || dslLvlCursor;
            }
            const dsl = (dslLvlCursor[config.id] = config.toDsl(this));
            let subAggs;
            parseParentAggs(dslLvlCursor, dsl);
            if (config.type.type === agg_groups_1.AggGroupNames.Buckets && i < list.length - 1) {
                // buckets that are not the last item in the list accept sub-aggs
                subAggs = dsl.aggs || (dsl.aggs = {});
            }
            if (subAggs && nestedMetrics) {
                nestedMetrics.forEach((agg) => {
                    subAggs[agg.config.id] = agg.dsl;
                    // if a nested metric agg has parent aggs, we have to add them to every level of the tree
                    // to make sure "bucket_path" references in the nested metric agg itself are still working
                    if (agg.dsl.parentAggs) {
                        Object.entries(agg.dsl.parentAggs).forEach(([parentAggId, parentAgg]) => {
                            subAggs[parentAggId] = parentAgg;
                        });
                    }
                });
            }
        });
        removeParentAggs(dslTopLvl);
        return dslTopLvl;
    }
    getAll() {
        return [...this.aggs];
    }
    byIndex(index) {
        return this.aggs[index];
    }
    byId(id) {
        return this.aggs.find((agg) => agg.id === id);
    }
    byName(name) {
        return this.aggs.filter((agg) => agg.type?.name === name);
    }
    byType(type) {
        return this.aggs.filter((agg) => agg.type?.type === type);
    }
    byTypeName(type) {
        return this.byName(type);
    }
    bySchemaName(schema) {
        return this.aggs.filter((agg) => agg.schema === schema);
    }
    getRequestAggs() {
        // collect all the aggregations
        const aggregations = this.aggs
            .filter((agg) => agg.enabled && agg.type)
            .reduce((requestValuesAggs, agg) => {
            const aggs = agg.getRequestAggs();
            return aggs ? requestValuesAggs.concat(aggs) : requestValuesAggs;
        }, []);
        // move metrics to the end
        return lodash_1.default.sortBy(aggregations, (agg) => agg.type.type === agg_groups_1.AggGroupNames.Metrics ? 1 : 0);
    }
    getRequestAggById(id) {
        return this.aggs.find((agg) => agg.id === id);
    }
    /**
     * Gets the AggConfigs (and possibly ResponseAggConfigs) that
     * represent the values that will be produced when all aggs
     * are run.
     *
     * With multi-value metric aggs it is possible for a single agg
     * request to result in multiple agg values, which is why the length
     * of a vis' responseValuesAggs may be different than the vis' aggs
     *
     * @return {array[AggConfig]}
     */
    getResponseAggs() {
        return this.getRequestAggs().reduce(function (responseValuesAggs, agg) {
            const aggs = agg.getResponseAggs();
            return aggs ? responseValuesAggs.concat(aggs) : responseValuesAggs;
        }, []);
    }
    /**
     * Find a response agg by it's id. This may be an agg in the aggConfigs, or one
     * created specifically for a response value
     *
     * @param  {string} id - the id of the agg to find
     * @return {AggConfig}
     */
    getResponseAggById(id) {
        id = String(id);
        const reqAgg = lodash_1.default.find(this.getRequestAggs(), function (agg) {
            return id.substr(0, String(agg.id).length) === agg.id;
        });
        if (!reqAgg)
            return;
        return lodash_1.default.find(reqAgg.getResponseAggs(), { id });
    }
    onSearchRequestStart(searchSource, options) {
        return Promise.all(
        // @ts-ignore
        this.getRequestAggs().map((agg) => agg.onSearchRequestStart(searchSource, options)));
    }
}
exports.AggConfigs = AggConfigs;
