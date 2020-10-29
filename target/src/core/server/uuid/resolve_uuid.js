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
exports.resolveInstanceUuid = exports.UUID_7_6_0_BUG = void 0;
const tslib_1 = require("tslib");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
const fs_1 = require("./fs");
const path_2 = require("../path");
const http_1 = require("../http");
const FILE_ENCODING = 'utf8';
const FILE_NAME = 'uuid';
/**
 * This UUID was inadvertantly shipped in the 7.6.0 distributable and should be deleted if found.
 * See https://github.com/elastic/kibana/issues/57673 for more info.
 */
exports.UUID_7_6_0_BUG = `ce42b997-a913-4d58-be46-bb1937feedd6`;
async function resolveInstanceUuid({ configService, syncToFile, logger, }) {
    const [pathConfig, serverConfig] = await Promise.all([
        configService.atPath(path_2.config.path).pipe(operators_1.take(1)).toPromise(),
        configService.atPath(http_1.config.path).pipe(operators_1.take(1)).toPromise(),
    ]);
    const uuidFilePath = path_1.join(pathConfig.data, FILE_NAME);
    const uuidFromFile = await readUuidFromFile(uuidFilePath, logger);
    const uuidFromConfig = serverConfig.uuid;
    if (uuidFromConfig) {
        if (uuidFromConfig === uuidFromFile) {
            // uuid matches, nothing to do
            logger.debug(`Kibana instance UUID: ${uuidFromConfig}`);
            return uuidFromConfig;
        }
        else {
            // uuid in file don't match, or file was not present, we need to write it.
            if (uuidFromFile === undefined) {
                logger.debug(`Setting new Kibana instance UUID: ${uuidFromConfig}`);
            }
            else {
                logger.debug(`Updating Kibana instance UUID to: ${uuidFromConfig} (was: ${uuidFromFile})`);
            }
            await writeUuidToFile(uuidFilePath, uuidFromConfig, syncToFile);
            return uuidFromConfig;
        }
    }
    if (uuidFromFile === undefined) {
        const newUuid = uuid_1.default.v4();
        // no uuid either in config or file, we need to generate and write it.
        logger.debug(`Setting new Kibana instance UUID: ${newUuid}`);
        await writeUuidToFile(uuidFilePath, newUuid, syncToFile);
        return newUuid;
    }
    logger.debug(`Resuming persistent Kibana instance UUID: ${uuidFromFile}`);
    return uuidFromFile;
}
exports.resolveInstanceUuid = resolveInstanceUuid;
async function readUuidFromFile(filepath, logger) {
    try {
        const content = await fs_1.readFile(filepath);
        const decoded = content.toString(FILE_ENCODING);
        if (decoded === exports.UUID_7_6_0_BUG) {
            logger.debug(`UUID from 7.6.0 bug detected, ignoring file UUID`);
            return undefined;
        }
        else {
            return decoded;
        }
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            // non-existent uuid file is ok, we will create it.
            return undefined;
        }
        throw new Error('Unable to read Kibana UUID file, please check the uuid.server configuration ' +
            'value in kibana.yml and ensure Kibana has sufficient permissions to read / write to this file. ' +
            `Error was: ${e.code}`);
    }
}
async function writeUuidToFile(filepath, uuidValue, syncToFile) {
    if (!syncToFile) {
        return;
    }
    try {
        return await fs_1.writeFile(filepath, uuidValue, { encoding: FILE_ENCODING });
    }
    catch (e) {
        throw new Error('Unable to write Kibana UUID file, please check the uuid.server configuration ' +
            'value in kibana.yml and ensure Kibana has sufficient permissions to read / write to this file. ' +
            `Error was: ${e.code}`);
    }
}
