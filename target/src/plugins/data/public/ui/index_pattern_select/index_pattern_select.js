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
exports.IndexPatternSelect = exports.createIndexPatternSelect = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const lib_1 = require("../../../common/index_patterns/lib");
const getIndexPatterns = async (client, search, fields) => {
    const resp = await client.find({
        type: 'index-pattern',
        fields,
        search: `${search}*`,
        searchFields: ['title'],
        perPage: 100,
    });
    return resp.savedObjects;
};
// Takes in stateful runtime dependencies and pre-wires them to the component
function createIndexPatternSelect(savedObjectsClient) {
    return (props) => (react_1.default.createElement(IndexPatternSelect, Object.assign({}, props, { savedObjectsClient: savedObjectsClient })));
}
exports.createIndexPatternSelect = createIndexPatternSelect;
class IndexPatternSelect extends react_1.Component {
    constructor(props) {
        super(props);
        this.isMounted = false;
        this.fetchSelectedIndexPattern = async (indexPatternId) => {
            if (!indexPatternId) {
                this.setState({
                    selectedIndexPattern: undefined,
                });
                return;
            }
            let indexPatternTitle;
            try {
                indexPatternTitle = await lib_1.getTitle(this.props.savedObjectsClient, indexPatternId);
            }
            catch (err) {
                // index pattern no longer exists
                return;
            }
            if (!this.isMounted) {
                return;
            }
            this.setState({
                selectedIndexPattern: {
                    value: indexPatternId,
                    label: indexPatternTitle,
                },
            });
        };
        this.debouncedFetch = lodash_1.default.debounce(async (searchValue) => {
            const { fieldTypes, onNoIndexPatterns, savedObjectsClient } = this.props;
            const savedObjectFields = ['title'];
            if (fieldTypes) {
                savedObjectFields.push('fields');
            }
            let savedObjects = await getIndexPatterns(savedObjectsClient, searchValue, savedObjectFields);
            if (fieldTypes) {
                savedObjects = savedObjects.filter((savedObject) => {
                    try {
                        const indexPatternFields = JSON.parse(savedObject.attributes.fields);
                        return indexPatternFields.some((field) => {
                            return fieldTypes?.includes(field.type);
                        });
                    }
                    catch (err) {
                        // Unable to parse fields JSON, invalid index pattern
                        return false;
                    }
                });
            }
            if (!this.isMounted) {
                return;
            }
            // We need this check to handle the case where search results come back in a different
            // order than they were sent out. Only load results for the most recent search.
            if (searchValue === this.state.searchValue) {
                const options = savedObjects.map((indexPatternSavedObject) => {
                    return {
                        label: indexPatternSavedObject.attributes.title,
                        value: indexPatternSavedObject.id,
                    };
                });
                this.setState({
                    isLoading: false,
                    options,
                });
                if (onNoIndexPatterns && searchValue === '' && options.length === 0) {
                    onNoIndexPatterns();
                }
            }
        }, 300);
        this.fetchOptions = (searchValue = '') => {
            this.setState({
                isLoading: true,
                searchValue,
            }, this.debouncedFetch.bind(null, searchValue));
        };
        this.onChange = (selectedOptions) => {
            this.props.onChange(lodash_1.default.get(selectedOptions, '0.value'));
        };
        this.state = {
            isLoading: false,
            options: [],
            selectedIndexPattern: undefined,
            searchValue: undefined,
        };
    }
    componentWillUnmount() {
        this.isMounted = false;
        this.debouncedFetch.cancel();
    }
    componentDidMount() {
        this.isMounted = true;
        this.fetchOptions();
        this.fetchSelectedIndexPattern(this.props.indexPatternId);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indexPatternId !== this.props.indexPatternId) {
            this.fetchSelectedIndexPattern(nextProps.indexPatternId);
        }
    }
    render() {
        const { fieldTypes, // eslint-disable-line no-unused-vars
        onChange, // eslint-disable-line no-unused-vars
        indexPatternId, // eslint-disable-line no-unused-vars
        placeholder, onNoIndexPatterns, // eslint-disable-line no-unused-vars
        savedObjectsClient, // eslint-disable-line no-unused-vars
        ...rest } = this.props;
        return (react_1.default.createElement(eui_1.EuiComboBox, Object.assign({}, rest, { placeholder: placeholder, singleSelection: true, isLoading: this.state.isLoading, onSearchChange: this.fetchOptions, options: this.state.options, selectedOptions: this.state.selectedIndexPattern ? [this.state.selectedIndexPattern] : [], onChange: this.onChange })));
    }
}
exports.IndexPatternSelect = IndexPatternSelect;
