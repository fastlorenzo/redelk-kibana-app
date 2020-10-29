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
exports.Executor = exports.FunctionsRegistry = exports.TypesRegistry = void 0;
const container_1 = require("./container");
const expression_functions_1 = require("../expression_functions");
const execution_1 = require("../execution/execution");
const expression_type_1 = require("../expression_types/expression_type");
const specs_1 = require("../expression_types/specs");
const specs_2 = require("../expression_functions/specs");
class TypesRegistry {
    constructor(executor) {
        this.executor = executor;
    }
    register(typeDefinition) {
        this.executor.registerType(typeDefinition);
    }
    get(id) {
        return this.executor.state.selectors.getType(id);
    }
    toJS() {
        return this.executor.getTypes();
    }
    toArray() {
        return Object.values(this.toJS());
    }
}
exports.TypesRegistry = TypesRegistry;
class FunctionsRegistry {
    constructor(executor) {
        this.executor = executor;
    }
    register(functionDefinition) {
        this.executor.registerFunction(functionDefinition);
    }
    get(id) {
        return this.executor.state.selectors.getFunction(id);
    }
    toJS() {
        return this.executor.getFunctions();
    }
    toArray() {
        return Object.values(this.toJS());
    }
}
exports.FunctionsRegistry = FunctionsRegistry;
class Executor {
    constructor(state) {
        this.state = container_1.createExecutorContainer(state);
        this.functions = new FunctionsRegistry(this);
        this.types = new TypesRegistry(this);
    }
    static createWithDefaults(state) {
        const executor = new Executor(state);
        for (const type of specs_1.typeSpecs)
            executor.registerType(type);
        for (const func of specs_2.functionSpecs)
            executor.registerFunction(func);
        return executor;
    }
    registerFunction(functionDefinition) {
        const fn = new expression_functions_1.ExpressionFunction(typeof functionDefinition === 'object' ? functionDefinition : functionDefinition());
        this.state.transitions.addFunction(fn);
    }
    getFunction(name) {
        return this.state.get().functions[name];
    }
    getFunctions() {
        return { ...this.state.get().functions };
    }
    registerType(typeDefinition) {
        const type = new expression_type_1.ExpressionType(typeof typeDefinition === 'object' ? typeDefinition : typeDefinition());
        this.state.transitions.addType(type);
    }
    getType(name) {
        return this.state.get().types[name];
    }
    getTypes() {
        return { ...this.state.get().types };
    }
    extendContext(extraContext) {
        this.state.transitions.extendContext(extraContext);
    }
    get context() {
        return this.state.selectors.getContext();
    }
    /**
     * Execute expression and return result.
     *
     * @param ast Expression AST or a string representing expression.
     * @param input Initial input to the first expression function.
     * @param context Extra global context object that will be merged into the
     *    expression global context object that is provided to each function to allow side-effects.
     */
    async run(ast, input, context) {
        const execution = this.createExecution(ast, context);
        execution.start(input);
        return (await execution.result);
    }
    createExecution(ast, context = {}, { debug } = {}) {
        const params = {
            executor: this,
            context: {
                ...this.context,
                ...context,
            },
            debug,
        };
        if (typeof ast === 'string')
            params.expression = ast;
        else
            params.ast = ast;
        const execution = new execution_1.Execution(params);
        return execution;
    }
    fork() {
        const initialState = this.state.get();
        const fork = new Executor(initialState);
        /**
         * Synchronize registry state - make any new types, functions and context
         * also available in the forked instance of `Executor`.
         */
        this.state.state$.subscribe(({ types, functions, context }) => {
            const state = fork.state.get();
            fork.state.set({
                ...state,
                types: {
                    ...types,
                    ...state.types,
                },
                functions: {
                    ...functions,
                    ...state.functions,
                },
                context: {
                    ...context,
                    ...state.context,
                },
            });
        });
        return fork;
    }
}
exports.Executor = Executor;
