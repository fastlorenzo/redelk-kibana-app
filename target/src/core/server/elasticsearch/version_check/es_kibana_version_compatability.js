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
exports.esVersionEqualsKibana = exports.esVersionCompatibleWithKibana = void 0;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importStar(require("semver"));
/**
 * Checks for the compatibilitiy between Elasticsearch and Kibana versions
 * 1. Major version differences will never work together.
 * 2. Older versions of ES won't work with newer versions of Kibana.
 */
function esVersionCompatibleWithKibana(esVersion, kibanaVersion) {
    const esVersionNumbers = {
        major: semver_1.default.major(esVersion),
        minor: semver_1.default.minor(esVersion),
        patch: semver_1.default.patch(esVersion),
    };
    const kibanaVersionNumbers = {
        major: semver_1.default.major(kibanaVersion),
        minor: semver_1.default.minor(kibanaVersion),
        patch: semver_1.default.patch(kibanaVersion),
    };
    // Reject mismatching major version numbers.
    if (esVersionNumbers.major !== kibanaVersionNumbers.major) {
        return false;
    }
    // Reject older minor versions of ES.
    if (esVersionNumbers.minor < kibanaVersionNumbers.minor) {
        return false;
    }
    return true;
}
exports.esVersionCompatibleWithKibana = esVersionCompatibleWithKibana;
function esVersionEqualsKibana(nodeVersion, kibanaVersion) {
    const nodeSemVer = semver_1.coerce(nodeVersion);
    const kibanaSemver = semver_1.coerce(kibanaVersion);
    return nodeSemVer && kibanaSemver && nodeSemVer.version === kibanaSemver.version;
}
exports.esVersionEqualsKibana = esVersionEqualsKibana;
