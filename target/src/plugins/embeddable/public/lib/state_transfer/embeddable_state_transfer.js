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
exports.EmbeddableStateTransfer = void 0;
const lodash_1 = require("lodash");
const types_1 = require("./types");
/**
 * A wrapper around the state object in {@link ScopedHistory | core scoped history} which provides
 * strongly typed helper methods for common incoming and outgoing states used by the embeddable infrastructure.
 *
 * @public
 */
class EmbeddableStateTransfer {
    constructor(navigateToApp, scopedHistory) {
        this.navigateToApp = navigateToApp;
        this.scopedHistory = scopedHistory;
    }
    /**
     * Fetches an {@link EmbeddableEditorState | originating app} argument from the scoped
     * history's location state.
     *
     * @param history - the scoped history to fetch from
     * @param options.keysToRemoveAfterFetch - an array of keys to be removed from the state after they are retrieved
     */
    getIncomingEditorState(options) {
        return this.getIncomingState(types_1.isEmbeddableEditorState, {
            keysToRemoveAfterFetch: options?.keysToRemoveAfterFetch,
        });
    }
    /**
     * Fetches an {@link EmbeddablePackageState | embeddable package} argument from the scoped
     * history's location state.
     *
     * @param history - the scoped history to fetch from
     * @param options.keysToRemoveAfterFetch - an array of keys to be removed from the state after they are retrieved
     */
    getIncomingEmbeddablePackage(options) {
        return this.getIncomingState(types_1.isEmbeddablePackageState, {
            keysToRemoveAfterFetch: options?.keysToRemoveAfterFetch,
        });
    }
    /**
     * A wrapper around the {@link ApplicationStart.navigateToApp} method which navigates to the specified appId
     * with {@link EmbeddableEditorState | embeddable editor state}
     */
    async navigateToEditor(appId, options) {
        await this.navigateToWithState(appId, options);
    }
    /**
     * A wrapper around the {@link ApplicationStart.navigateToApp} method which navigates to the specified appId
     * with {@link EmbeddablePackageState | embeddable package state}
     */
    async navigateToWithEmbeddablePackage(appId, options) {
        await this.navigateToWithState(appId, options);
    }
    getIncomingState(guard, options) {
        if (!this.scopedHistory) {
            throw new TypeError('ScopedHistory is required to fetch incoming state');
        }
        const incomingState = this.scopedHistory.location?.state;
        const castState = !guard || guard(incomingState) ? lodash_1.cloneDeep(incomingState) : undefined;
        if (castState && options?.keysToRemoveAfterFetch) {
            const stateReplace = { ...this.scopedHistory.location.state };
            options.keysToRemoveAfterFetch.forEach((key) => {
                delete stateReplace[key];
            });
            this.scopedHistory.replace({ ...this.scopedHistory.location, state: stateReplace });
        }
        return castState;
    }
    async navigateToWithState(appId, options) {
        const stateObject = options?.appendToExistingState && this.scopedHistory
            ? {
                ...this.scopedHistory?.location.state,
                ...options.state,
            }
            : options?.state;
        await this.navigateToApp(appId, { path: options?.path, state: stateObject });
    }
}
exports.EmbeddableStateTransfer = EmbeddableStateTransfer;
