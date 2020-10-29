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
exports.configureClient = void 0;
const querystring_1 = require("querystring");
const elasticsearch_1 = require("@elastic/elasticsearch");
const client_config_1 = require("./client_config");
exports.configureClient = (config, { logger, scoped = false }) => {
    const clientOptions = client_config_1.parseClientOptions(config, scoped);
    const client = new elasticsearch_1.Client(clientOptions);
    addLogging(client, logger, config.logQueries);
    return client;
};
const addLogging = (client, logger, logQueries) => {
    client.on('response', (err, event) => {
        if (err) {
            logger.error(`${err.name}: ${err.message}`);
        }
        if (event && logQueries) {
            const params = event.meta.request.params;
            // definition is wrong, `params.querystring` can be either a string or an object
            const querystring = convertQueryString(params.querystring);
            logger.debug(`${event.statusCode}\n${params.method} ${params.path}${querystring ? `\n${querystring}` : ''}`, {
                tags: ['query'],
            });
        }
    });
};
const convertQueryString = (qs) => {
    if (qs === undefined || typeof qs === 'string') {
        return qs ?? '';
    }
    return querystring_1.stringify(qs);
};
