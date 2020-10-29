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
exports.Execution = void 0;
const lodash_1 = require("lodash");
const container_1 = require("./container");
const util_1 = require("../util");
const common_1 = require("../../../kibana_utils/common");
const abort_utils_1 = require("../../../data/common/utils/abort_utils");
const common_2 = require("../../../inspector/common");
const error_1 = require("../expression_types/specs/error");
const ast_1 = require("../ast");
const expression_types_1 = require("../expression_types");
const get_by_alias_1 = require("../util/get_by_alias");
const execution_contract_1 = require("./execution_contract");
const createAbortErrorValue = () => util_1.createError({
    message: 'The expression was aborted.',
    name: 'AbortError',
});
const createDefaultInspectorAdapters = () => ({
    requests: new common_2.RequestAdapter(),
    data: new common_2.DataAdapter(),
});
class Execution {
    constructor(params) {
        this.params = params;
        /**
         * Initial input of the execution.
         *
         * N.B. It is initialized to `null` rather than `undefined` for legacy reasons,
         * because in legacy interpreter it was set to `null` by default.
         */
        this.input = null;
        /**
         * AbortController to cancel this Execution.
         */
        this.abortController = new AbortController();
        /**
         * Promise that rejects if/when abort controller sends "abort" signal.
         */
        this.abortRejection = abort_utils_1.toPromise(this.abortController.signal);
        /**
         * Whether .start() method has been called.
         */
        this.hasStarted = false;
        /**
         * Future that tracks result or error of this execution.
         */
        this.firstResultFuture = new common_1.Defer();
        /**
         * Contract is a public representation of `Execution` instances. Contract we
         * can return to other plugins for their consumption.
         */
        this.contract = new execution_contract_1.ExecutionContract(this);
        const { executor } = params;
        if (!params.ast && !params.expression) {
            throw new TypeError('Execution params should contain at least .ast or .expression key.');
        }
        else if (params.ast && params.expression) {
            throw new TypeError('Execution params cannot contain both .ast and .expression key.');
        }
        this.expression = params.expression || ast_1.formatExpression(params.ast);
        const ast = params.ast || ast_1.parseExpression(this.expression);
        this.state = container_1.createExecutionContainer({
            ...executor.state.get(),
            state: 'not-started',
            ast,
        });
        this.context = {
            getInitialInput: () => this.input,
            variables: {},
            types: executor.getTypes(),
            abortSignal: this.abortController.signal,
            ...(params.context || {}),
            inspectorAdapters: (params.context && params.context.inspectorAdapters
                ? params.context.inspectorAdapters
                : createDefaultInspectorAdapters()),
        };
    }
    /**
     * Races a given promise against the "abort" event of `abortController`.
     */
    race(promise) {
        return Promise.race([this.abortRejection, promise]);
    }
    get result() {
        return this.firstResultFuture.promise;
    }
    get inspectorAdapters() {
        return this.context.inspectorAdapters;
    }
    /**
     * Stop execution of expression.
     */
    cancel() {
        this.abortController.abort();
    }
    /**
     * Call this method to start execution.
     *
     * N.B. `input` is initialized to `null` rather than `undefined` for legacy reasons,
     * because in legacy interpreter it was set to `null` by default.
     */
    start(input = null) {
        if (this.hasStarted)
            throw new Error('Execution already started.');
        this.hasStarted = true;
        this.input = input;
        this.state.transitions.start();
        const { resolve, reject } = this.firstResultFuture;
        const chainPromise = this.invokeChain(this.state.get().ast.chain, input);
        this.race(chainPromise).then(resolve, (error) => {
            if (this.abortController.signal.aborted)
                resolve(createAbortErrorValue());
            else
                reject(error);
        });
        this.firstResultFuture.promise.then((result) => {
            this.state.transitions.setResult(result);
        }, (error) => {
            this.state.transitions.setError(error);
        });
    }
    async invokeChain(chainArr, input) {
        if (!chainArr.length)
            return input;
        for (const link of chainArr) {
            const { function: fnName, arguments: fnArgs } = link;
            const fn = get_by_alias_1.getByAlias(this.state.get().functions, fnName);
            if (!fn) {
                return util_1.createError({ message: `Function ${fnName} could not be found.` });
            }
            let args = {};
            let timeStart;
            try {
                // `resolveArgs` returns an object because the arguments themselves might
                // actually have a `then` function which would be treated as a `Promise`.
                const { resolvedArgs } = await this.race(this.resolveArgs(fn, input, fnArgs));
                args = resolvedArgs;
                timeStart = this.params.debug ? common_1.now() : 0;
                const output = await this.race(this.invokeFunction(fn, input, resolvedArgs));
                if (this.params.debug) {
                    const timeEnd = common_1.now();
                    link.debug = {
                        success: true,
                        fn,
                        input,
                        args: resolvedArgs,
                        output,
                        duration: timeEnd - timeStart,
                    };
                }
                if (expression_types_1.getType(output) === 'error')
                    return output;
                input = output;
            }
            catch (rawError) {
                const timeEnd = this.params.debug ? common_1.now() : 0;
                const error = util_1.createError(rawError);
                error.error.message = `[${fnName}] > ${error.error.message}`;
                if (this.params.debug) {
                    link.debug = {
                        success: false,
                        fn,
                        input,
                        args,
                        error,
                        rawError,
                        duration: timeStart ? timeEnd - timeStart : undefined,
                    };
                }
                return error;
            }
        }
        return input;
    }
    async invokeFunction(fn, input, args) {
        const normalizedInput = this.cast(input, fn.inputTypes);
        const output = await this.race(fn.fn(normalizedInput, args, this.context));
        // Validate that the function returned the type it said it would.
        // This isn't required, but it keeps function developers honest.
        const returnType = expression_types_1.getType(output);
        const expectedType = fn.type;
        if (expectedType && returnType !== expectedType) {
            throw new Error(`Function '${fn.name}' should return '${expectedType}',` +
                ` actually returned '${returnType}'`);
        }
        // Validate the function output against the type definition's validate function.
        const type = this.context.types[fn.type];
        if (type && type.validate) {
            try {
                type.validate(output);
            }
            catch (e) {
                throw new Error(`Output of '${fn.name}' is not a valid type '${fn.type}': ${e}`);
            }
        }
        return output;
    }
    cast(value, toTypeNames) {
        // If you don't give us anything to cast to, you'll get your input back
        if (!toTypeNames || toTypeNames.length === 0)
            return value;
        // No need to cast if node is already one of the valid types
        const fromTypeName = expression_types_1.getType(value);
        if (toTypeNames.includes(fromTypeName))
            return value;
        const { types } = this.state.get();
        const fromTypeDef = types[fromTypeName];
        for (const toTypeName of toTypeNames) {
            // First check if the current type can cast to this type
            if (fromTypeDef && fromTypeDef.castsTo(toTypeName)) {
                return fromTypeDef.to(value, toTypeName, types);
            }
            // If that isn't possible, check if this type can cast from the current type
            const toTypeDef = types[toTypeName];
            if (toTypeDef && toTypeDef.castsFrom(fromTypeName))
                return toTypeDef.from(value, types);
        }
        throw new Error(`Can not cast '${fromTypeName}' to any of '${toTypeNames.join(', ')}'`);
    }
    // Processes the multi-valued AST argument values into arguments that can be passed to the function
    async resolveArgs(fnDef, input, argAsts) {
        const argDefs = fnDef.args;
        // Use the non-alias name from the argument definition
        const dealiasedArgAsts = lodash_1.reduce(argAsts, (acc, argAst, argName) => {
            const argDef = get_by_alias_1.getByAlias(argDefs, argName);
            if (!argDef) {
                throw new Error(`Unknown argument '${argName}' passed to function '${fnDef.name}'`);
            }
            acc[argDef.name] = (acc[argDef.name] || []).concat(argAst);
            return acc;
        }, {});
        // Check for missing required arguments.
        for (const argDef of Object.values(argDefs)) {
            const { aliases, default: argDefault, name: argName, required } = argDef;
            if (typeof argDefault !== 'undefined' ||
                !required ||
                typeof dealiasedArgAsts[argName] !== 'undefined')
                continue;
            if (!aliases || aliases.length === 0) {
                throw new Error(`${fnDef.name} requires an argument`);
            }
            // use an alias if _ is the missing arg
            const errorArg = argName === '_' ? aliases[0] : argName;
            throw new Error(`${fnDef.name} requires an "${errorArg}" argument`);
        }
        // Fill in default values from argument definition
        const argAstsWithDefaults = lodash_1.reduce(argDefs, (acc, argDef, argName) => {
            if (typeof acc[argName] === 'undefined' && typeof argDef.default !== 'undefined') {
                acc[argName] = [ast_1.parse(argDef.default, 'argument')];
            }
            return acc;
        }, dealiasedArgAsts);
        // Create the functions to resolve the argument ASTs into values
        // These are what are passed to the actual functions if you opt out of resolving
        const resolveArgFns = lodash_1.mapValues(argAstsWithDefaults, (asts, argName) => {
            return asts.map((item) => {
                return async (subInput = input) => {
                    const output = await this.interpret(item, subInput, {
                        debug: this.params.debug,
                    });
                    if (error_1.isExpressionValueError(output))
                        throw output.error;
                    const casted = this.cast(output, argDefs[argName].types);
                    return casted;
                };
            });
        });
        const argNames = lodash_1.keys(resolveArgFns);
        // Actually resolve unless the argument definition says not to
        const resolvedArgValues = await Promise.all(argNames.map((argName) => {
            const interpretFns = resolveArgFns[argName];
            if (!argDefs[argName].resolve)
                return interpretFns;
            return Promise.all(interpretFns.map((fn) => fn()));
        }));
        const resolvedMultiArgs = lodash_1.zipObject(argNames, resolvedArgValues);
        // Just return the last unless the argument definition allows multiple
        const resolvedArgs = lodash_1.mapValues(resolvedMultiArgs, (argValues, argName) => {
            if (argDefs[argName].multi)
                return argValues;
            return lodash_1.last(argValues);
        });
        // Return an object here because the arguments themselves might actually have a 'then'
        // function which would be treated as a promise
        return { resolvedArgs };
    }
    async interpret(ast, input, options) {
        switch (expression_types_1.getType(ast)) {
            case 'expression':
                const execution = this.params.executor.createExecution(ast, this.context, options);
                execution.start(input);
                return await execution.result;
            case 'string':
            case 'number':
            case 'null':
            case 'boolean':
                return ast;
            default:
                throw new Error(`Unknown AST object: ${JSON.stringify(ast)}`);
        }
    }
}
exports.Execution = Execution;
