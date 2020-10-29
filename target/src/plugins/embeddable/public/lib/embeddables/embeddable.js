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
exports.Embeddable = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const Rx = tslib_1.__importStar(require("rxjs"));
const types_1 = require("../types");
function getPanelTitle(input, output) {
    return input.hidePanelTitles ? '' : input.title === undefined ? output.defaultTitle : input.title;
}
class Embeddable {
    constructor(input, output, parent) {
        this.runtimeId = Embeddable.runtimeId++;
        this.isContainer = false;
        this.destroyed = false;
        this.id = input.id;
        this.output = {
            title: getPanelTitle(input, output),
            ...output,
        };
        this.input = {
            viewMode: types_1.ViewMode.EDIT,
            ...input,
        };
        this.parent = parent;
        this.input$ = new Rx.BehaviorSubject(this.input);
        this.output$ = new Rx.BehaviorSubject(this.output);
        if (parent) {
            this.parentSubscription = Rx.merge(parent.getInput$(), parent.getOutput$()).subscribe(() => {
                // Make sure this panel hasn't been removed immediately after it was added, but before it finished loading.
                if (!parent.getInput().panels[this.id])
                    return;
                const newInput = parent.getInputForChild(this.id);
                this.onResetInput(newInput);
            });
        }
    }
    getIsContainer() {
        return this.isContainer === true;
    }
    getInput$() {
        return this.input$.asObservable();
    }
    getOutput$() {
        return this.output$.asObservable();
    }
    getOutput() {
        return this.output;
    }
    getInput() {
        return this.input;
    }
    getTitle() {
        return this.output.title;
    }
    /**
     * Returns the top most parent embeddable, or itself if this embeddable
     * is not within a parent.
     */
    getRoot() {
        let root = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }
    updateInput(changes) {
        if (this.destroyed) {
            throw new Error('Embeddable has been destroyed');
        }
        if (this.parent) {
            // Ensures state changes flow from container downward.
            this.parent.updateInputForChild(this.id, changes);
        }
        else {
            this.onInputChanged(changes);
        }
    }
    render(domNode) {
        if (this.destroyed) {
            throw new Error('Embeddable has been destroyed');
        }
        return;
    }
    /**
     * An embeddable can return inspector adapters if it want the inspector to be
     * available via the context menu of that panel.
     * @return Inspector adapters that will be used to open an inspector for.
     */
    getInspectorAdapters() {
        return undefined;
    }
    /**
     * Called when this embeddable is no longer used, this should be the place for
     * implementors to add any additional clean up tasks, like unmounting and unsubscribing.
     */
    destroy() {
        this.destroyed = true;
        this.input$.complete();
        this.output$.complete();
        if (this.parentSubscription) {
            this.parentSubscription.unsubscribe();
        }
        return;
    }
    updateOutput(outputChanges) {
        const newOutput = {
            ...this.output,
            ...outputChanges,
        };
        if (!lodash_1.isEqual(this.output, newOutput)) {
            this.output = newOutput;
            this.output$.next(this.output);
        }
    }
    onResetInput(newInput) {
        if (!lodash_1.isEqual(this.input, newInput)) {
            if (this.input.lastReloadRequestTime !== newInput.lastReloadRequestTime) {
                this.reload();
            }
            this.input = newInput;
            this.input$.next(newInput);
            this.updateOutput({
                title: getPanelTitle(this.input, this.output),
            });
        }
    }
    onInputChanged(changes) {
        const newInput = lodash_1.cloneDeep({
            ...this.input,
            ...changes,
        });
        this.onResetInput(newInput);
    }
    supportedTriggers() {
        return [];
    }
}
exports.Embeddable = Embeddable;
Embeddable.runtimeId = 0;
