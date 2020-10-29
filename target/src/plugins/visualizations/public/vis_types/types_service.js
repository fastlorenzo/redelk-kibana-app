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
exports.TypesService = void 0;
const vis_type_alias_registry_1 = require("./vis_type_alias_registry");
// @ts-ignore
const base_vis_type_1 = require("./base_vis_type");
// @ts-ignore
const react_vis_type_1 = require("./react_vis_type");
/**
 * Vis Types Service
 *
 * @internal
 */
class TypesService {
    constructor() {
        this.types = {};
        this.unregisteredHiddenTypes = [];
    }
    setup() {
        const registerVisualization = (registerFn) => {
            const visDefinition = registerFn();
            if (this.unregisteredHiddenTypes.includes(visDefinition.name)) {
                visDefinition.hidden = true;
            }
            if (this.types[visDefinition.name]) {
                throw new Error('type already exists!');
            }
            this.types[visDefinition.name] = visDefinition;
        };
        return {
            /**
             * registers a visualization type
             * @param {VisType} config - visualization type definition
             */
            createBaseVisualization: (config) => {
                const vis = new base_vis_type_1.BaseVisType(config);
                registerVisualization(() => vis);
            },
            /**
             * registers a visualization which uses react for rendering
             * @param {VisType} config - visualization type definition
             */
            createReactVisualization: (config) => {
                const vis = new react_vis_type_1.ReactVisType(config);
                registerVisualization(() => vis);
            },
            /**
             * registers a visualization alias
             * alias is a visualization type without implementation, it just redirects somewhere in kibana
             * @param {VisTypeAlias} config - visualization alias definition
             */
            registerAlias: vis_type_alias_registry_1.visTypeAliasRegistry.add,
            /**
             * allows to hide specific visualization types from create visualization dialog
             * @param {string[]} typeNames - list of type ids to hide
             */
            hideTypes: (typeNames) => {
                typeNames.forEach((name) => {
                    if (this.types[name]) {
                        this.types[name].hidden = true;
                    }
                    else {
                        this.unregisteredHiddenTypes.push(name);
                    }
                });
            },
        };
    }
    start() {
        return {
            /**
             * returns specific visualization or undefined if not found
             * @param {string} visualization - id of visualization to return
             */
            get: (visualization) => {
                return this.types[visualization];
            },
            /**
             * returns all registered visualization types
             */
            all: () => {
                return [...Object.values(this.types)];
            },
            /**
             * returns all registered aliases
             */
            getAliases: vis_type_alias_registry_1.visTypeAliasRegistry.get,
        };
    }
    stop() {
        // nothing to do here yet
    }
}
exports.TypesService = TypesService;
/** @public static code */
// TODO once items are moved from ui/vis into this service
