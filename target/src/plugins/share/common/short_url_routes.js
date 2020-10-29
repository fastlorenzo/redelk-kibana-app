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
exports.CREATE_PATH = exports.getUrlPath = exports.GETTER_PREFIX = exports.getGotoPath = exports.getUrlIdFromGotoRoute = exports.GOTO_PREFIX = void 0;
exports.GOTO_PREFIX = '/goto';
exports.getUrlIdFromGotoRoute = (path) => path.match(new RegExp(`${exports.GOTO_PREFIX}/(.*)$`))?.[1];
exports.getGotoPath = (urlId) => `${exports.GOTO_PREFIX}/${urlId}`;
exports.GETTER_PREFIX = '/api/short_url';
exports.getUrlPath = (urlId) => `${exports.GETTER_PREFIX}/${urlId}`;
exports.CREATE_PATH = '/api/shorten_url';
