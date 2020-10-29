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
exports.TriggerInternal = void 0;
const trigger_contract_1 = require("./trigger_contract");
const context_menu_1 = require("../context_menu");
/**
 * Internal representation of a trigger kept for consumption only internally
 * within `ui_actions` plugin.
 */
class TriggerInternal {
    constructor(service, trigger) {
        this.service = service;
        this.trigger = trigger;
        this.contract = new trigger_contract_1.TriggerContract(this);
    }
    async execute(context) {
        const triggerId = this.trigger.id;
        const actions = await this.service.getTriggerCompatibleActions(triggerId, context);
        if (!actions.length) {
            throw new Error(`No compatible actions found to execute for trigger [triggerId = ${triggerId}].`);
        }
        if (actions.length === 1) {
            await this.executeSingleAction(actions[0], context);
            return;
        }
        await this.executeMultipleActions(actions, context);
    }
    async executeSingleAction(action, context) {
        await action.execute(context);
    }
    async executeMultipleActions(actions, context) {
        const panel = await context_menu_1.buildContextMenuForActions({
            actions,
            actionContext: context,
            title: this.trigger.title,
            closeMenu: () => session.close(),
        });
        const session = context_menu_1.openContextMenu([panel], {
            'data-test-subj': 'multipleActionsContextMenu',
        });
    }
}
exports.TriggerInternal = TriggerInternal;
