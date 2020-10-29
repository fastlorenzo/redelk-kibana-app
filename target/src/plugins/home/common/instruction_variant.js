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
exports.getDisplayText = exports.INSTRUCTION_VARIANT = void 0;
exports.INSTRUCTION_VARIANT = {
    ESC: 'esc',
    OSX: 'osx',
    DEB: 'deb',
    RPM: 'rpm',
    DOCKER: 'docker',
    WINDOWS: 'windows',
    NODE: 'node',
    DJANGO: 'django',
    FLASK: 'flask',
    RAILS: 'rails',
    RACK: 'rack',
    JS: 'js',
    GO: 'go',
    JAVA: 'java',
    DOTNET: 'dotnet',
    LINUX: 'linux',
};
const DISPLAY_MAP = {
    [exports.INSTRUCTION_VARIANT.ESC]: 'Elastic Cloud',
    [exports.INSTRUCTION_VARIANT.OSX]: 'macOS',
    [exports.INSTRUCTION_VARIANT.DEB]: 'DEB',
    [exports.INSTRUCTION_VARIANT.RPM]: 'RPM',
    [exports.INSTRUCTION_VARIANT.DOCKER]: 'Docker',
    [exports.INSTRUCTION_VARIANT.WINDOWS]: 'Windows',
    [exports.INSTRUCTION_VARIANT.NODE]: 'Node.js',
    [exports.INSTRUCTION_VARIANT.DJANGO]: 'Django',
    [exports.INSTRUCTION_VARIANT.FLASK]: 'Flask',
    [exports.INSTRUCTION_VARIANT.RAILS]: 'Ruby on Rails',
    [exports.INSTRUCTION_VARIANT.RACK]: 'Rack',
    [exports.INSTRUCTION_VARIANT.JS]: 'RUM (JS)',
    [exports.INSTRUCTION_VARIANT.GO]: 'Go',
    [exports.INSTRUCTION_VARIANT.JAVA]: 'Java',
    [exports.INSTRUCTION_VARIANT.DOTNET]: '.NET',
    [exports.INSTRUCTION_VARIANT.LINUX]: 'Linux',
};
/**
 * Convert instruction variant id into display text.
 *
 * @params {String} id - instruction variant id as defined from INSTRUCTION_VARIANT
 * @return {String} display name
 */
function getDisplayText(id) {
    if (id in DISPLAY_MAP) {
        return DISPLAY_MAP[id];
    }
    return id;
}
exports.getDisplayText = getDisplayText;
