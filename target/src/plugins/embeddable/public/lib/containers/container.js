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
exports.Container = void 0;
const tslib_1 = require("tslib");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const rxjs_1 = require("rxjs");
const embeddables_1 = require("../embeddables");
const errors_1 = require("../errors");
const saved_object_embeddable_1 = require("../embeddables/saved_object_embeddable");
const getKeys = (o) => Object.keys(o);
class Container extends embeddables_1.Embeddable {
    constructor(input, output, getFactory, parent) {
        super(input, output, parent);
        this.getFactory = getFactory;
        this.isContainer = true;
        this.children = {};
        this.subscription = this.getInput$().subscribe(() => this.maybeUpdateChildren());
    }
    updateInputForChild(id, changes) {
        if (!this.input.panels[id]) {
            throw new errors_1.PanelNotFoundError();
        }
        const panels = {
            panels: {
                ...this.input.panels,
                [id]: {
                    ...this.input.panels[id],
                    explicitInput: {
                        ...this.input.panels[id].explicitInput,
                        ...changes,
                    },
                },
            },
        };
        this.updateInput(panels);
    }
    reload() {
        Object.values(this.children).forEach((child) => child.reload());
    }
    async addNewEmbeddable(type, explicitInput) {
        const factory = this.getFactory(type);
        if (!factory) {
            throw new errors_1.EmbeddableFactoryNotFoundError(type);
        }
        const panelState = this.createNewPanelState(factory, explicitInput);
        return this.createAndSaveEmbeddable(type, panelState);
    }
    removeEmbeddable(embeddableId) {
        // Just a shortcut for removing the panel from input state, all internal state will get cleaned up naturally
        // by the listener.
        const panels = { ...this.input.panels };
        delete panels[embeddableId];
        this.updateInput({ panels });
    }
    getChildIds() {
        return Object.keys(this.children);
    }
    getChild(id) {
        return this.children[id];
    }
    getInputForChild(embeddableId) {
        const containerInput = this.getInheritedInput(embeddableId);
        const panelState = this.getPanelState(embeddableId);
        const explicitInput = panelState.explicitInput;
        const explicitFiltered = {};
        const keys = getKeys(panelState.explicitInput);
        // If explicit input for a particular value is undefined, and container has that input defined,
        // we will use the inherited container input. This way children can set a value to undefined in order
        // to default back to inherited input. However, if the particular value is not part of the container, then
        // the caller may be trying to explicitly tell the child to clear out a given value, so in that case, we want
        // to pass it along.
        keys.forEach((key) => {
            if (explicitInput[key] === undefined && containerInput[key] !== undefined) {
                return;
            }
            explicitFiltered[key] = explicitInput[key];
        });
        return {
            ...containerInput,
            ...explicitFiltered,
        };
    }
    destroy() {
        super.destroy();
        Object.values(this.children).forEach((child) => child.destroy());
        this.subscription.unsubscribe();
    }
    async untilEmbeddableLoaded(id) {
        if (!this.input.panels[id]) {
            throw new errors_1.PanelNotFoundError();
        }
        if (this.output.embeddableLoaded[id]) {
            return this.children[id];
        }
        return new Promise((resolve, reject) => {
            const subscription = rxjs_1.merge(this.getOutput$(), this.getInput$()).subscribe(() => {
                if (this.output.embeddableLoaded[id]) {
                    subscription.unsubscribe();
                    resolve(this.children[id]);
                }
                // If we hit this, the panel was removed before the embeddable finished loading.
                if (this.input.panels[id] === undefined) {
                    subscription.unsubscribe();
                    resolve(undefined);
                }
            });
        });
    }
    createNewPanelState(factory, partial = {}) {
        const embeddableId = partial.id || uuid_1.default.v4();
        const explicitInput = this.createNewExplicitEmbeddableInput(embeddableId, factory, partial);
        return {
            type: factory.type,
            explicitInput: {
                id: embeddableId,
                ...explicitInput,
            },
        };
    }
    getPanelState(embeddableId) {
        if (this.input.panels[embeddableId] === undefined) {
            throw new errors_1.PanelNotFoundError();
        }
        const panelState = this.input.panels[embeddableId];
        return panelState;
    }
    async createAndSaveEmbeddable(type, panelState) {
        this.updateInput({
            panels: {
                ...this.input.panels,
                [panelState.explicitInput.id]: panelState,
            },
        });
        return await this.untilEmbeddableLoaded(panelState.explicitInput.id);
    }
    createNewExplicitEmbeddableInput(id, factory, partial = {}) {
        const inheritedInput = this.getInheritedInput(id);
        const defaults = factory.getDefaultInput(partial);
        // Container input overrides defaults.
        const explicitInput = partial;
        getKeys(defaults).forEach((key) => {
            // @ts-ignore We know this key might not exist on inheritedInput.
            const inheritedValue = inheritedInput[key];
            if (inheritedValue === undefined && explicitInput[key] === undefined) {
                explicitInput[key] = defaults[key];
            }
        });
        return explicitInput;
    }
    onPanelRemoved(id) {
        // Clean up
        const embeddable = this.getChild(id);
        if (embeddable) {
            embeddable.destroy();
            // Remove references.
            delete this.children[id];
        }
        this.updateOutput({
            embeddableLoaded: {
                ...this.output.embeddableLoaded,
                [id]: undefined,
            },
        });
    }
    async onPanelAdded(panel) {
        this.updateOutput({
            embeddableLoaded: {
                ...this.output.embeddableLoaded,
                [panel.explicitInput.id]: false,
            },
        });
        let embeddable;
        const inputForChild = this.getInputForChild(panel.explicitInput.id);
        try {
            const factory = this.getFactory(panel.type);
            if (!factory) {
                throw new errors_1.EmbeddableFactoryNotFoundError(panel.type);
            }
            // TODO: lets get rid of this distinction with factories, I don't think it will be needed
            // anymore after this change.
            embeddable = saved_object_embeddable_1.isSavedObjectEmbeddableInput(inputForChild)
                ? await factory.createFromSavedObject(inputForChild.savedObjectId, inputForChild, this)
                : await factory.create(inputForChild, this);
        }
        catch (e) {
            embeddable = new embeddables_1.ErrorEmbeddable(e, { id: panel.explicitInput.id }, this);
        }
        // EmbeddableFactory.create can return undefined without throwing an error, which indicates that an embeddable
        // can't be created.  This logic essentially only exists to support the current use case of
        // visualizations being created from the add panel, which redirects the user to the visualize app. Once we
        // switch over to inline creation we can probably clean this up, and force EmbeddableFactory.create to always
        // return an embeddable, or throw an error.
        if (embeddable) {
            // make sure the panel wasn't removed in the mean time, since the embeddable creation is async
            if (!this.input.panels[panel.explicitInput.id]) {
                embeddable.destroy();
                return;
            }
            this.children[embeddable.id] = embeddable;
            this.updateOutput({
                embeddableLoaded: {
                    ...this.output.embeddableLoaded,
                    [panel.explicitInput.id]: true,
                },
            });
        }
        else if (embeddable === undefined) {
            this.removeEmbeddable(panel.explicitInput.id);
        }
        return embeddable;
    }
    maybeUpdateChildren() {
        const allIds = Object.keys({ ...this.input.panels, ...this.output.embeddableLoaded });
        allIds.forEach((id) => {
            if (this.input.panels[id] !== undefined && this.output.embeddableLoaded[id] === undefined) {
                this.onPanelAdded(this.input.panels[id]);
            }
            else if (this.input.panels[id] === undefined &&
                this.output.embeddableLoaded[id] !== undefined) {
                this.onPanelRemoved(id);
            }
        });
    }
}
exports.Container = Container;
