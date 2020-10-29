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
exports.useVisualizeAppState = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const operators_1 = require("rxjs/operators");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../kibana_react/public");
const public_2 = require("../../../../../data/public");
const utils_1 = require("../utils");
const create_visualize_app_state_1 = require("../create_visualize_app_state");
const visualize_constants_1 = require("../../visualize_constants");
/**
 * This effect is responsible for instantiating the visualize app state container,
 * which is in sync with "_a" url param
 */
exports.useVisualizeAppState = (services, eventEmitter, instance) => {
    const [hasUnappliedChanges, setHasUnappliedChanges] = react_1.useState(false);
    const [appState, setAppState] = react_1.useState(null);
    react_1.useEffect(() => {
        if (instance) {
            const stateDefaults = utils_1.visStateToEditorState(instance, services);
            const { stateContainer, stopStateSync } = create_visualize_app_state_1.createVisualizeAppState({
                stateDefaults,
                kbnUrlStateStorage: services.kbnUrlStateStorage,
            });
            const onDirtyStateChange = ({ isDirty }) => {
                if (!isDirty) {
                    // it is important to update vis state with fresh data
                    stateContainer.transitions.updateVisState(utils_1.visStateToEditorState(instance, services).vis);
                }
                setHasUnappliedChanges(isDirty);
            };
            eventEmitter.on('dirtyStateChange', onDirtyStateChange);
            const { filterManager } = services.data.query;
            // sync initial app filters from state to filterManager
            filterManager.setAppFilters(lodash_1.cloneDeep(stateContainer.getState().filters));
            // setup syncing of app filters between appState and filterManager
            const stopSyncingAppFilters = public_2.connectToQueryState(services.data.query, {
                set: ({ filters }) => stateContainer.transitions.set('filters', filters),
                get: () => ({ filters: stateContainer.getState().filters }),
                state$: stateContainer.state$.pipe(operators_1.map((state) => ({ filters: state.filters }))),
            }, {
                filters: public_2.esFilters.FilterStateStore.APP_STATE,
            });
            // The savedVis is pulled from elasticsearch, but the appState is pulled from the url, with the
            // defaults applied. If the url was from a previous session which included modifications to the
            // appState then they won't be equal.
            if (!lodash_1.isEqual(stateContainer.getState().vis, stateDefaults.vis)) {
                const { aggs, ...visState } = stateContainer.getState().vis;
                instance.vis
                    .setState({ ...visState, data: { aggs } })
                    .then(() => {
                    // setting up the stateContainer after setState is successful will prevent loading the editor with failures
                    // otherwise the catch will take presedence
                    setAppState(stateContainer);
                })
                    .catch((error) => {
                    // if setting new vis state was failed for any reason,
                    // redirect to the listing page with error message
                    services.toastNotifications.addWarning({
                        title: i18n_1.i18n.translate('visualize.visualizationLoadingFailedErrorMessage', {
                            defaultMessage: 'Failed to load the visualization',
                        }),
                        text: public_1.toMountPoint(react_1.default.createElement(public_1.MarkdownSimple, null, error.message)),
                    });
                    services.history.replace(`${visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH}?notFound=visualization`);
                });
            }
            else {
                setAppState(stateContainer);
            }
            // don't forget to clean up
            return () => {
                eventEmitter.off('dirtyStateChange', onDirtyStateChange);
                stopStateSync();
                stopSyncingAppFilters();
            };
        }
    }, [eventEmitter, instance, services]);
    return { appState, hasUnappliedChanges };
};
