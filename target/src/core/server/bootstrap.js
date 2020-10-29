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
exports.bootstrap = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cluster_1 = require("cluster");
const config_1 = require("./config");
const root_1 = require("./root");
const errors_1 = require("./errors");
/**
 *
 * @internal
 * @param param0 - options
 */
async function bootstrap({ configs, cliArgs, applyConfigOverrides, features, }) {
    if (cliArgs.repl && !features.isReplModeSupported) {
        onRootShutdown('Kibana REPL mode can only be run in development mode.');
    }
    const env = config_1.Env.createDefault({
        configs,
        cliArgs,
        isDevClusterMaster: cluster_1.isMaster && cliArgs.dev && features.isClusterModeSupported,
    });
    const rawConfigService = new config_1.RawConfigService(env.configs, applyConfigOverrides);
    rawConfigService.loadConfig();
    const root = new root_1.Root(rawConfigService, env, onRootShutdown);
    process.on('SIGHUP', () => reloadLoggingConfig());
    // This is only used by the LogRotator service
    // in order to be able to reload the log configuration
    // under the cluster mode
    process.on('message', (msg) => {
        if (!msg || msg.reloadLoggingConfig !== true) {
            return;
        }
        reloadLoggingConfig();
    });
    function reloadLoggingConfig() {
        const cliLogger = root.logger.get('cli');
        cliLogger.info('Reloading logging configuration due to SIGHUP.', { tags: ['config'] });
        try {
            rawConfigService.reloadConfig();
        }
        catch (err) {
            return shutdown(err);
        }
        cliLogger.info('Reloaded logging configuration due to SIGHUP.', { tags: ['config'] });
    }
    process.on('SIGINT', () => shutdown());
    process.on('SIGTERM', () => shutdown());
    function shutdown(reason) {
        rawConfigService.stop();
        return root.shutdown(reason);
    }
    try {
        await root.setup();
        await root.start();
    }
    catch (err) {
        await shutdown(err);
    }
    if (cliArgs.optimize) {
        const cliLogger = root.logger.get('cli');
        cliLogger.info('Optimization done.');
        await shutdown();
    }
}
exports.bootstrap = bootstrap;
function onRootShutdown(reason) {
    if (reason !== undefined) {
        // There is a chance that logger wasn't configured properly and error that
        // that forced root to shut down could go unnoticed. To prevent this we always
        // mirror such fatal errors in standard output with `console.error`.
        // eslint-disable-next-line
        console.error(`\n${chalk_1.default.white.bgRed(' FATAL ')} ${reason}\n`);
        process.exit(reason instanceof errors_1.CriticalError ? reason.processExitCode : 1);
    }
    process.exit(0);
}
