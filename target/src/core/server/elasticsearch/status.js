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
exports.calculateStatus$ = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const status_1 = require("../status");
exports.calculateStatus$ = (esNodesCompatibility$) => rxjs_1.merge(rxjs_1.of({
    level: status_1.ServiceStatusLevels.unavailable,
    summary: `Waiting for Elasticsearch`,
    meta: {
        warningNodes: [],
        incompatibleNodes: [],
    },
}), esNodesCompatibility$.pipe(operators_1.map(({ isCompatible, message, incompatibleNodes, warningNodes, }) => {
    if (!isCompatible) {
        return {
            level: status_1.ServiceStatusLevels.critical,
            summary: 
            // Message should always be present, but this is a safe fallback
            message ??
                `Some Elasticsearch nodes are not compatible with this version of Kibana`,
            meta: { warningNodes, incompatibleNodes },
        };
    }
    else if (warningNodes.length > 0) {
        return {
            level: status_1.ServiceStatusLevels.available,
            summary: 
            // Message should always be present, but this is a safe fallback
            message ??
                `Some Elasticsearch nodes are running different versions than this version of Kibana`,
            meta: { warningNodes, incompatibleNodes },
        };
    }
    return {
        level: status_1.ServiceStatusLevels.available,
        summary: `Elasticsearch is available`,
        meta: {
            warningNodes: [],
            incompatibleNodes: [],
        },
    };
})));
