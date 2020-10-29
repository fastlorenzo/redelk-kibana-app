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
exports.ExpressionsPublicPlugin = void 0;
const common_1 = require("../common");
const services_1 = require("./services");
const react_expression_renderer_1 = require("./react_expression_renderer");
const loader_1 = require("./loader");
const render_1 = require("./render");
class ExpressionsPublicPlugin {
    constructor(initializerContext) {
        this.expressions = new common_1.ExpressionsService();
    }
    configureExecutor(core) {
        const { executor } = this.expressions;
        const getSavedObject = async (type, id) => {
            const [start] = await core.getStartServices();
            return start.savedObjects.client.get(type, id);
        };
        executor.extendContext({
            environment: 'client',
            getSavedObject,
        });
    }
    setup(core, { bfetch }) {
        this.configureExecutor(core);
        const { expressions } = this;
        const { executor, renderers } = expressions;
        services_1.setRenderersRegistry(renderers);
        services_1.setExpressionsService(this.expressions);
        const expressionsSetup = expressions.setup();
        // This is legacy. Should go away when we get rid of __LEGACY.
        const getExecutor = () => {
            return { interpreter: { interpretAst: expressionsSetup.run } };
        };
        services_1.setInterpreter(getExecutor().interpreter);
        let cached = null;
        const loadLegacyServerFunctionWrappers = async () => {
            if (!cached) {
                cached = (async () => {
                    const serverFunctionList = await core.http.get(`/api/interpreter/fns`);
                    const batchedFunction = bfetch.batchedFunction({ url: `/api/interpreter/fns` });
                    const { serialize } = common_1.serializeProvider(executor.getTypes());
                    // For every sever-side function, register a client-side
                    // function that matches its definition, but which simply
                    // calls the server-side function endpoint.
                    Object.keys(serverFunctionList).forEach((functionName) => {
                        if (expressionsSetup.getFunction(functionName)) {
                            return;
                        }
                        const fn = () => ({
                            ...serverFunctionList[functionName],
                            fn: (input, args) => {
                                return batchedFunction({ functionName, args, context: serialize(input) });
                            },
                        });
                        expressionsSetup.registerFunction(fn);
                    });
                })();
            }
            return cached;
        };
        const setup = {
            ...expressionsSetup,
            __LEGACY: {
                types: executor.types,
                functions: executor.functions,
                renderers,
                getExecutor,
                loadLegacyServerFunctionWrappers,
            },
        };
        return Object.freeze(setup);
    }
    start(core, { bfetch }) {
        services_1.setCoreStart(core);
        services_1.setNotifications(core.notifications);
        const { expressions } = this;
        const start = {
            ...expressions.start(),
            ExpressionLoader: loader_1.ExpressionLoader,
            ExpressionRenderHandler: render_1.ExpressionRenderHandler,
            loader: loader_1.loader,
            ReactExpressionRenderer: react_expression_renderer_1.ReactExpressionRenderer,
            render: render_1.render,
        };
        return Object.freeze(start);
    }
    stop() {
        this.expressions.stop();
    }
}
exports.ExpressionsPublicPlugin = ExpressionsPublicPlugin;
