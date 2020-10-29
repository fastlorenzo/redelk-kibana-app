"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddablePublicPlugin = void 0;
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../data/public");
const public_2 = require("../../saved_objects/public");
const bootstrap_1 = require("./bootstrap");
const lib_1 = require("./lib");
const attribute_service_1 = require("./lib/embeddables/attribute_service");
const state_transfer_1 = require("./lib/state_transfer");
class EmbeddablePublicPlugin {
    constructor(initializerContext) {
        this.embeddableFactoryDefinitions = new Map();
        this.embeddableFactories = new Map();
        this.outgoingOnlyStateTransfer = {};
        this.isRegistryReady = false;
        this.getEmbeddableFactories = () => {
            this.ensureFactoriesExist();
            return this.embeddableFactories.values();
        };
        this.registerEmbeddableFactory = (embeddableFactoryId, factory) => {
            if (this.embeddableFactoryDefinitions.has(embeddableFactoryId)) {
                throw new Error(`Embeddable factory [embeddableFactoryId = ${embeddableFactoryId}] already registered in Embeddables API.`);
            }
            this.embeddableFactoryDefinitions.set(embeddableFactoryId, factory);
            return () => {
                return this.getEmbeddableFactory(embeddableFactoryId);
            };
        };
        this.getEmbeddableFactory = (embeddableFactoryId) => {
            if (!this.isRegistryReady) {
                throw new Error('Embeddable factories can only be retrieved after setup lifecycle.');
            }
            this.ensureFactoryExists(embeddableFactoryId);
            const factory = this.embeddableFactories.get(embeddableFactoryId);
            if (!factory) {
                throw new Error(`Embeddable factory [embeddableFactoryId = ${embeddableFactoryId}] does not exist.`);
            }
            return factory;
        };
        // These two functions are only to support legacy plugins registering factories after the start lifecycle.
        this.ensureFactoriesExist = () => {
            this.embeddableFactoryDefinitions.forEach((def) => this.ensureFactoryExists(def.type));
        };
        this.ensureFactoryExists = (type) => {
            if (!this.embeddableFactories.get(type)) {
                const def = this.embeddableFactoryDefinitions.get(type);
                if (!def)
                    return;
                this.embeddableFactories.set(type, this.customEmbeddableFactoryProvider
                    ? this.customEmbeddableFactoryProvider(def)
                    : lib_1.defaultEmbeddableFactoryProvider(def));
            }
        };
    }
    setup(core, { uiActions }) {
        bootstrap_1.bootstrap(uiActions);
        return {
            registerEmbeddableFactory: this.registerEmbeddableFactory,
            setCustomEmbeddableFactoryProvider: (provider) => {
                if (this.customEmbeddableFactoryProvider) {
                    throw new Error('Custom embeddable factory provider is already set, and can only be set once');
                }
                this.customEmbeddableFactoryProvider = provider;
            },
        };
    }
    start(core, { data, uiActions, inspector }) {
        this.embeddableFactoryDefinitions.forEach((def) => {
            this.embeddableFactories.set(def.type, this.customEmbeddableFactoryProvider
                ? this.customEmbeddableFactoryProvider(def)
                : lib_1.defaultEmbeddableFactoryProvider(def));
        });
        this.outgoingOnlyStateTransfer = new state_transfer_1.EmbeddableStateTransfer(core.application.navigateToApp);
        this.isRegistryReady = true;
        const filtersFromContext = async (context) => {
            try {
                if (lib_1.isRangeSelectTriggerContext(context))
                    return await data.actions.createFiltersFromRangeSelectAction(context.data);
                if (lib_1.isValueClickTriggerContext(context))
                    return await data.actions.createFiltersFromValueClickAction(context.data);
                // eslint-disable-next-line no-console
                console.warn("Can't extract filters from action.", context);
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.warn('Error extracting filters from action. Returning empty filter list.', error);
            }
            return [];
        };
        const filtersAndTimeRangeFromContext = async (context) => {
            const filters = await filtersFromContext(context);
            if (!context.data.timeFieldName)
                return { filters };
            const { timeRangeFilter, restOfFilters } = public_1.esFilters.extractTimeFilter(context.data.timeFieldName, filters);
            return {
                filters: restOfFilters,
                timeRange: timeRangeFilter
                    ? public_1.esFilters.convertRangeFilterToTimeRangeString(timeRangeFilter)
                    : undefined,
            };
        };
        const getEmbeddablePanelHoc = (stateTransfer) => ({ embeddable, hideHeader, }) => (react_1.default.createElement(lib_1.EmbeddablePanel, { hideHeader: hideHeader, embeddable: embeddable, stateTransfer: stateTransfer ? stateTransfer : this.outgoingOnlyStateTransfer, getActions: uiActions.getTriggerCompatibleActions, getEmbeddableFactory: this.getEmbeddableFactory, getAllEmbeddableFactories: this.getEmbeddableFactories, overlays: core.overlays, notifications: core.notifications, application: core.application, inspector: inspector, SavedObjectFinder: public_2.getSavedObjectFinder(core.savedObjects, core.uiSettings) }));
        return {
            getEmbeddableFactory: this.getEmbeddableFactory,
            getEmbeddableFactories: this.getEmbeddableFactories,
            getAttributeService: (type) => new attribute_service_1.AttributeService(type, core.savedObjects.client),
            filtersFromContext,
            filtersAndTimeRangeFromContext,
            getStateTransfer: (history) => {
                return history
                    ? new state_transfer_1.EmbeddableStateTransfer(core.application.navigateToApp, history)
                    : this.outgoingOnlyStateTransfer;
            },
            EmbeddablePanel: getEmbeddablePanelHoc(),
            getEmbeddablePanel: getEmbeddablePanelHoc,
        };
    }
    stop() { }
}
exports.EmbeddablePublicPlugin = EmbeddablePublicPlugin;
