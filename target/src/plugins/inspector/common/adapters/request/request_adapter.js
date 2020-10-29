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
exports.RequestAdapter = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const v4_1 = tslib_1.__importDefault(require("uuid/v4"));
const request_responder_1 = require("./request_responder");
const types_1 = require("./types");
/**
 * An generic inspector adapter to log requests.
 * These can be presented in the inspector using the requests view.
 * The adapter is not coupled to a specific implementation or even Elasticsearch
 * instead it offers a generic API to log requests of any kind.
 * @extends EventEmitter
 */
class RequestAdapter extends events_1.EventEmitter {
    constructor() {
        super();
        this.requests = new Map();
    }
    /**
     * Start logging a new request into this request adapter. The new request will
     * by default be in a processing state unless you explicitly finish it via
     * {@link RequestResponder#finish}, {@link RequestResponder#ok} or
     * {@link RequestResponder#error}.
     *
     * @param  {string} name The name of this request as it should be shown in the UI.
     * @param  {object} args Additional arguments for the request.
     * @return {RequestResponder} An instance to add information to the request and finish it.
     */
    start(name, params = {}) {
        const req = {
            ...params,
            name,
            startTime: Date.now(),
            status: types_1.RequestStatus.PENDING,
            id: params.id ?? v4_1.default(),
        };
        this.requests.set(req.id, req);
        this._onChange();
        return new request_responder_1.RequestResponder(req, () => this._onChange());
    }
    reset() {
        this.requests = new Map();
        this._onChange();
    }
    resetRequest(id) {
        this.requests.delete(id);
        this._onChange();
    }
    getRequests() {
        return Array.from(this.requests.values());
    }
    _onChange() {
        this.emit('change');
    }
}
exports.RequestAdapter = RequestAdapter;
