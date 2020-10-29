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
exports.RouteValidator = void 0;
const config_schema_1 = require("@kbn/config-schema");
const stream_1 = require("stream");
const validator_error_1 = require("./validator_error");
/**
 * Route validator class to define the validation logic for each new route.
 *
 * @internal
 */
class RouteValidator {
    constructor(config, options = {}) {
        this.config = config;
        this.options = options;
    }
    static from(opts) {
        if (opts instanceof RouteValidator) {
            return opts;
        }
        const { params, query, body, ...options } = opts;
        return new RouteValidator({ params, query, body }, options);
    }
    /**
     * Get validated URL params
     * @internal
     */
    getParams(data, namespace) {
        return this.validate(this.config.params, this.options.unsafe?.params, data, namespace);
    }
    /**
     * Get validated query params
     * @internal
     */
    getQuery(data, namespace) {
        return this.validate(this.config.query, this.options.unsafe?.query, data, namespace);
    }
    /**
     * Get validated body
     * @internal
     */
    getBody(data, namespace) {
        return this.validate(this.config.body, this.options.unsafe?.body, data, namespace);
    }
    /**
     * Has body validation
     * @internal
     */
    hasBody() {
        return typeof this.config.body !== 'undefined';
    }
    validate(validationRule, unsafe, data, namespace) {
        if (typeof validationRule === 'undefined') {
            return {};
        }
        let precheckedData = this.preValidateSchema(data).validate(data, {}, namespace);
        if (unsafe !== true) {
            precheckedData = this.safetyPrechecks(precheckedData, namespace);
        }
        const customCheckedData = this.customValidation(validationRule, precheckedData, namespace);
        if (unsafe === true) {
            return customCheckedData;
        }
        return this.safetyPostchecks(customCheckedData, namespace);
    }
    safetyPrechecks(data, namespace) {
        // We can add any pre-validation safety logic in here
        return data;
    }
    safetyPostchecks(data, namespace) {
        // We can add any post-validation safety logic in here
        return data;
    }
    customValidation(validationRule, data, namespace) {
        if (config_schema_1.isConfigSchema(validationRule)) {
            return validationRule.validate(data, {}, namespace);
        }
        else if (typeof validationRule === 'function') {
            return this.validateFunction(validationRule, data, namespace);
        }
        else {
            throw new config_schema_1.ValidationError(new validator_error_1.RouteValidationError(`The validation rule provided in the handler is not valid`), namespace);
        }
    }
    validateFunction(validateFn, data, namespace) {
        let result;
        try {
            result = validateFn(data, RouteValidator.ResultFactory);
        }
        catch (err) {
            result = { error: new validator_error_1.RouteValidationError(err) };
        }
        if (result.error) {
            throw new config_schema_1.ValidationError(result.error, namespace);
        }
        return result.value;
    }
    preValidateSchema(data) {
        if (Buffer.isBuffer(data)) {
            // if options.body.parse !== true
            return config_schema_1.schema.buffer();
        }
        else if (data instanceof stream_1.Stream) {
            // if options.body.output === 'stream'
            return config_schema_1.schema.stream();
        }
        else {
            return config_schema_1.schema.maybe(config_schema_1.schema.nullable(config_schema_1.schema.any({})));
        }
    }
}
exports.RouteValidator = RouteValidator;
RouteValidator.ResultFactory = {
    ok: (value) => ({ value }),
    badRequest: (error, path) => ({
        error: new validator_error_1.RouteValidationError(error, path),
    }),
};
