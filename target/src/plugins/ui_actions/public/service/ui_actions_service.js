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
exports.UiActionsService = void 0;
const actions_1 = require("../actions");
const trigger_internal_1 = require("../triggers/trigger_internal");
class UiActionsService {
    constructor({ triggers = new Map(), actions = new Map(), triggerToActions = new Map(), } = {}) {
        this.registerTrigger = (trigger) => {
            if (this.triggers.has(trigger.id)) {
                throw new Error(`Trigger [trigger.id = ${trigger.id}] already registered.`);
            }
            const triggerInternal = new trigger_internal_1.TriggerInternal(this, trigger);
            this.triggers.set(trigger.id, triggerInternal);
            this.triggerToActions.set(trigger.id, []);
        };
        this.getTrigger = (triggerId) => {
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`Trigger [triggerId = ${triggerId}] does not exist.`);
            }
            return trigger.contract;
        };
        this.registerAction = (definition) => {
            if (this.actions.has(definition.id)) {
                throw new Error(`Action [action.id = ${definition.id}] already registered.`);
            }
            const action = new actions_1.ActionInternal(definition);
            this.actions.set(action.id, action);
            return action;
        };
        this.unregisterAction = (actionId) => {
            if (!this.actions.has(actionId)) {
                throw new Error(`Action [action.id = ${actionId}] is not registered.`);
            }
            this.actions.delete(actionId);
        };
        this.attachAction = (triggerId, actionId) => {
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`No trigger [triggerId = ${triggerId}] exists, for attaching action [actionId = ${actionId}].`);
            }
            const actionIds = this.triggerToActions.get(triggerId);
            if (!actionIds.find((id) => id === actionId)) {
                this.triggerToActions.set(triggerId, [...actionIds, actionId]);
            }
        };
        this.detachAction = (triggerId, actionId) => {
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`No trigger [triggerId = ${triggerId}] exists, for detaching action [actionId = ${actionId}].`);
            }
            const actionIds = this.triggerToActions.get(triggerId);
            this.triggerToActions.set(triggerId, actionIds.filter((id) => id !== actionId));
        };
        /**
         * `addTriggerAction` is similar to `attachAction` as it attaches action to a
         * trigger, but it also registers the action, if it has not been registered, yet.
         *
         * `addTriggerAction` also infers better typing of the `action` argument.
         */
        this.addTriggerAction = (triggerId, 
        // The action can accept partial or no context, but if it needs context not provided
        // by this type of trigger, typescript will complain. yay!
        action) => {
            if (!this.actions.has(action.id))
                this.registerAction(action);
            this.attachAction(triggerId, action.id);
        };
        this.getAction = (id) => {
            if (!this.actions.has(id)) {
                throw new Error(`Action [action.id = ${id}] not registered.`);
            }
            return this.actions.get(id);
        };
        this.getTriggerActions = (triggerId) => {
            // This line checks if trigger exists, otherwise throws.
            this.getTrigger(triggerId);
            const actionIds = this.triggerToActions.get(triggerId);
            const actions = actionIds
                .map((actionId) => this.actions.get(actionId))
                .filter(Boolean);
            return actions;
        };
        this.getTriggerCompatibleActions = async (triggerId, context) => {
            const actions = this.getTriggerActions(triggerId);
            const isCompatibles = await Promise.all(actions.map((action) => action.isCompatible(context)));
            return actions.reduce((acc, action, i) => isCompatibles[i] ? [...acc, action] : acc, []);
        };
        /**
         * @deprecated
         *
         * Use `plugins.uiActions.getTrigger(triggerId).exec(params)` instead.
         */
        this.executeTriggerActions = async (triggerId, context) => {
            const trigger = this.getTrigger(triggerId);
            await trigger.exec(context);
        };
        /**
         * Removes all registered triggers and actions.
         */
        this.clear = () => {
            this.actions.clear();
            this.triggers.clear();
            this.triggerToActions.clear();
        };
        /**
         * "Fork" a separate instance of `UiActionsService` that inherits all existing
         * triggers and actions, but going forward all new triggers and actions added
         * to this instance of `UiActionsService` are only available within this instance.
         */
        this.fork = () => {
            const triggers = new Map();
            const actions = new Map();
            const triggerToActions = new Map();
            for (const [key, value] of this.triggers.entries())
                triggers.set(key, value);
            for (const [key, value] of this.actions.entries())
                actions.set(key, value);
            for (const [key, value] of this.triggerToActions.entries())
                triggerToActions.set(key, [...value]);
            return new UiActionsService({ triggers, actions, triggerToActions });
        };
        this.triggers = triggers;
        this.actions = actions;
        this.triggerToActions = triggerToActions;
    }
}
exports.UiActionsService = UiActionsService;
