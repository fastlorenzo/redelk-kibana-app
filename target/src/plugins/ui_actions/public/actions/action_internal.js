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
exports.ActionInternal = void 0;
const public_1 = require("../../../kibana_react/public");
/**
 * @internal
 */
class ActionInternal {
    constructor(definition) {
        this.definition = definition;
        this.id = this.definition.id;
        this.type = this.definition.type || '';
        this.order = this.definition.order || 0;
        this.MenuItem = this.definition.MenuItem;
        this.ReactMenuItem = this.MenuItem ? public_1.uiToReactComponent(this.MenuItem) : undefined;
    }
    execute(context) {
        return this.definition.execute(context);
    }
    getIconType(context) {
        if (!this.definition.getIconType)
            return undefined;
        return this.definition.getIconType(context);
    }
    getDisplayName(context) {
        if (!this.definition.getDisplayName)
            return `Action: ${this.id}`;
        return this.definition.getDisplayName(context);
    }
    getDisplayNameTooltip(context) {
        if (!this.definition.getDisplayNameTooltip)
            return '';
        return this.definition.getDisplayNameTooltip(context);
    }
    async isCompatible(context) {
        if (!this.definition.isCompatible)
            return true;
        return await this.definition.isCompatible(context);
    }
    async getHref(context) {
        if (!this.definition.getHref)
            return undefined;
        return await this.definition.getHref(context);
    }
}
exports.ActionInternal = ActionInternal;
