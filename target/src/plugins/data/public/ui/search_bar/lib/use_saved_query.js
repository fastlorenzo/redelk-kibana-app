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
exports.useSavedQuery = void 0;
const react_1 = require("react");
const i18n_1 = require("@kbn/i18n");
const populate_state_from_saved_query_1 = require("./populate_state_from_saved_query");
const clear_saved_query_1 = require("./clear_saved_query");
exports.useSavedQuery = (props) => {
    // Handle saved queries
    const defaultLanguage = props.defaultLanguage;
    const [savedQuery, setSavedQuery] = react_1.useState();
    // Effect is used to convert a saved query id into an object
    react_1.useEffect(() => {
        const fetchSavedQuery = async (savedQueryId) => {
            try {
                // fetch saved query
                const newSavedQuery = await props.queryService.savedQueries.getSavedQuery(savedQueryId);
                // Make sure we set the saved query to the most recent one
                if (newSavedQuery && newSavedQuery.id === savedQueryId) {
                    setSavedQuery(newSavedQuery);
                    populate_state_from_saved_query_1.populateStateFromSavedQuery(props.queryService, props.setQuery, newSavedQuery);
                }
            }
            catch (error) {
                // Clear saved query
                setSavedQuery(undefined);
                clear_saved_query_1.clearStateFromSavedQuery(props.queryService, props.setQuery, defaultLanguage);
                // notify of saving error
                props.notifications.toasts.addWarning({
                    title: i18n_1.i18n.translate('data.search.unableToGetSavedQueryToastTitle', {
                        defaultMessage: 'Unable to load saved query {savedQueryId}',
                        values: { savedQueryId },
                    }),
                    text: `${error.message}`,
                });
            }
        };
        if (props.savedQueryId)
            fetchSavedQuery(props.savedQueryId);
        else
            setSavedQuery(undefined);
    }, [
        defaultLanguage,
        props.notifications.toasts,
        props.queryService,
        props.queryService.savedQueries,
        props.savedQueryId,
        props.setQuery,
    ]);
    return {
        savedQuery,
        setSavedQuery: (q) => {
            setSavedQuery(q);
            populate_state_from_saved_query_1.populateStateFromSavedQuery(props.queryService, props.setQuery, q);
        },
        clearSavedQuery: () => {
            setSavedQuery(undefined);
            clear_saved_query_1.clearStateFromSavedQuery(props.queryService, props.setQuery, defaultLanguage);
        },
    };
};
