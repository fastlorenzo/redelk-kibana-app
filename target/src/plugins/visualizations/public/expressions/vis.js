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
exports.ExprVis = void 0;
const tslib_1 = require("tslib");
/**
 * @name Vis
 *
 * @description This class consists of aggs, params, listeners, title, and type.
 *  - Aggs: Instances of AggConfig.
 *  - Params: The settings in the Options tab.
 *
 * Not to be confused with vislib/vis.js.
 */
const events_1 = require("events");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const public_1 = require("../../../../plugins/visualizations/public");
const services_1 = require("../services");
class ExprVis extends events_1.EventEmitter {
    constructor(visState = { type: 'histogram' }) {
        super();
        this.title = '';
        this.params = {};
        this.sessionState = {};
        this.type = this.getType(visState.type);
        this.uiState = new public_1.PersistedState();
        this.setState(visState);
        this.API = {
            events: {
                filter: (data) => {
                    if (!this.eventsSubject)
                        return;
                    this.eventsSubject.next({
                        name: 'filterBucket',
                        data: data.data
                            ? {
                                data: data.data,
                                negate: data.negate,
                            }
                            : { data: [data] },
                    });
                },
                brush: (data) => {
                    if (!this.eventsSubject)
                        return;
                    this.eventsSubject.next({ name: 'brush', data });
                },
            },
        };
    }
    getType(type) {
        if (lodash_1.default.isString(type)) {
            const newType = services_1.getTypes().get(type);
            if (!newType) {
                throw new Error(`Invalid type "${type}"`);
            }
            return newType;
        }
        else {
            return type;
        }
    }
    setState(state) {
        this.title = state.title || '';
        if (state.type) {
            this.type = this.getType(state.type);
        }
        this.params = lodash_1.default.defaultsDeep({}, lodash_1.default.cloneDeep(state.params || {}), lodash_1.default.cloneDeep(this.type.visConfig.defaults || {}));
    }
    getState() {
        return {
            title: this.title,
            type: this.type.name,
            params: lodash_1.default.cloneDeep(this.params),
        };
    }
    updateState() {
        this.emit('update');
    }
    forceReload() {
        this.emit('reload');
    }
    isHierarchical() {
        if (lodash_1.default.isFunction(this.type.hierarchicalData)) {
            return !!this.type.hierarchicalData(this);
        }
        else {
            return !!this.type.hierarchicalData;
        }
    }
    hasUiState() {
        return !!this.uiState;
    }
    getUiState() {
        return this.uiState;
    }
    setUiState(state) {
        this.uiState = state;
    }
    /**
     * Currently this is only used to extract map-specific information
     * (e.g. mapZoom, mapCenter).
     */
    uiStateVal(key, val) {
        if (this.hasUiState()) {
            if (lodash_1.default.isUndefined(val)) {
                return this.uiState.get(key);
            }
            return this.uiState.set(key, val);
        }
        return val;
    }
}
exports.ExprVis = ExprVis;
