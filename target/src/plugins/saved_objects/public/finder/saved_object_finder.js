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
exports.SavedObjectFinderUi = exports.getSavedObjectFinder = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const common_1 = require("../../common");
class SavedObjectFinderUi extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.isComponentMounted = false;
        this.debouncedFetch = lodash_1.default.debounce(async (query) => {
            const metaDataMap = this.getSavedObjectMetaDataMap();
            const fields = Object.values(metaDataMap)
                .map((metaData) => metaData.includeFields || [])
                .reduce((allFields, currentFields) => allFields.concat(currentFields), ['title']);
            const perPage = this.props.uiSettings.get(common_1.LISTING_LIMIT_SETTING);
            const resp = await this.props.savedObjects.client.find({
                type: Object.keys(metaDataMap),
                fields: [...new Set(fields)],
                search: query ? `${query}*` : undefined,
                page: 1,
                perPage,
                searchFields: ['title^3', 'description'],
                defaultSearchOperator: 'AND',
            });
            resp.savedObjects = resp.savedObjects.filter((savedObject) => {
                const metaData = metaDataMap[savedObject.type];
                if (metaData.showSavedObject) {
                    return metaData.showSavedObject(savedObject);
                }
                else {
                    return true;
                }
            });
            if (!this.isComponentMounted) {
                return;
            }
            // We need this check to handle the case where search results come back in a different
            // order than they were sent out. Only load results for the most recent search.
            if (query === this.state.query) {
                this.setState({
                    isFetchingItems: false,
                    page: 0,
                    items: resp.savedObjects.map((savedObject) => {
                        const { attributes: { title }, id, type, } = savedObject;
                        return {
                            title: typeof title === 'string' ? title : '',
                            id,
                            type,
                            savedObject,
                        };
                    }),
                });
            }
        }, 300);
        // server-side paging not supported
        // 1) saved object client does not support sorting by title because title is only mapped as analyzed
        // 2) can not search on anything other than title because all other fields are stored in opaque JSON strings,
        //    for example, visualizations need to be search by isLab but this is not possible in Elasticsearch side
        //    with the current mappings
        this.getPageOfItems = () => {
            // do not sort original list to preserve elasticsearch ranking order
            const items = this.state.items.slice();
            const { sortDirection } = this.state;
            if (sortDirection || !this.state.query) {
                items.sort(({ title: titleA }, { title: titleB }) => {
                    let order = 1;
                    if (sortDirection === 'desc') {
                        order = -1;
                    }
                    return order * (titleA || '').toLowerCase().localeCompare((titleB || '').toLowerCase());
                });
            }
            // If begin is greater than the length of the sequence, an empty array is returned.
            const startIndex = this.state.page * this.state.perPage;
            // If end is greater than the length of the sequence, slice extracts through to the end of the sequence (arr.length).
            const lastIndex = startIndex + this.state.perPage;
            return items
                .filter((item) => this.state.filteredTypes.length === 0 || this.state.filteredTypes.includes(item.type))
                .slice(startIndex, lastIndex);
        };
        this.fetchItems = () => {
            this.setState({
                isFetchingItems: true,
            }, this.debouncedFetch.bind(null, this.state.query));
        };
        this.state = {
            items: [],
            isFetchingItems: false,
            page: 0,
            perPage: props.initialPageSize || props.fixedPageSize || 10,
            query: '',
            filterOpen: false,
            filteredTypes: [],
            sortOpen: false,
        };
    }
    componentWillUnmount() {
        this.isComponentMounted = false;
        this.debouncedFetch.cancel();
    }
    componentDidMount() {
        this.isComponentMounted = true;
        this.fetchItems();
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.renderSearchBar(),
            this.renderListing()));
    }
    getSavedObjectMetaDataMap() {
        return this.props.savedObjectMetaData.reduce((map, metaData) => ({ ...map, [metaData.type]: metaData }), {});
    }
    getPageCount() {
        return Math.ceil((this.state.filteredTypes.length === 0
            ? this.state.items.length
            : this.state.items.filter((item) => this.state.filteredTypes.length === 0 || this.state.filteredTypes.includes(item.type)).length) / this.state.perPage);
    }
    getAvailableSavedObjectMetaData() {
        const typesInItems = new Set();
        this.state.items.forEach((item) => {
            typesInItems.add(item.type);
        });
        return this.props.savedObjectMetaData.filter((metaData) => typesInItems.has(metaData.type));
    }
    getSortOptions() {
        const sortOptions = [
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "asc", icon: this.state.sortDirection === 'asc' ||
                    (this.state.query === '' && this.state.sortDirection !== 'desc')
                    ? 'check'
                    : 'empty', onClick: () => {
                    this.setState({
                        sortDirection: 'asc',
                    });
                } }, i18n_1.i18n.translate('savedObjects.finder.sortAsc', {
                defaultMessage: 'Ascending',
            })),
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "desc", icon: this.state.sortDirection === 'desc' ? 'check' : 'empty', onClick: () => {
                    this.setState({
                        sortDirection: 'desc',
                    });
                } }, i18n_1.i18n.translate('savedObjects.finder.sortDesc', {
                defaultMessage: 'Descending',
            })),
        ];
        if (this.state.query) {
            sortOptions.push(react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "auto", icon: !this.state.sortDirection ? 'check' : 'empty', onClick: () => {
                    this.setState({
                        sortDirection: undefined,
                    });
                } }, i18n_1.i18n.translate('savedObjects.finder.sortAuto', {
                defaultMessage: 'Best match',
            })));
        }
        return sortOptions;
    }
    renderSearchBar() {
        const availableSavedObjectMetaData = this.getAvailableSavedObjectMetaData();
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "m" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: i18n_1.i18n.translate('savedObjects.finder.searchPlaceholder', {
                        defaultMessage: 'Search…',
                    }), "aria-label": i18n_1.i18n.translate('savedObjects.finder.searchPlaceholder', {
                        defaultMessage: 'Search…',
                    }), fullWidth: true, value: this.state.query, onChange: (e) => {
                        this.setState({
                            query: e.target.value,
                        }, this.fetchItems);
                    }, "data-test-subj": "savedObjectFinderSearchInput", isLoading: this.state.isFetchingItems })),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFilterGroup, null,
                    react_1.default.createElement(eui_1.EuiPopover, { id: "addPanelSortPopover", panelClassName: "euiFilterGroup__popoverPanel", panelPaddingSize: "none", isOpen: this.state.sortOpen, closePopover: () => this.setState({ sortOpen: false }), button: react_1.default.createElement(eui_1.EuiFilterButton, { onClick: () => this.setState(({ sortOpen }) => ({
                                sortOpen: !sortOpen,
                            })), iconType: "arrowDown", isSelected: this.state.sortOpen, "data-test-subj": "savedObjectFinderSortButton" }, i18n_1.i18n.translate('savedObjects.finder.sortButtonLabel', {
                            defaultMessage: 'Sort',
                        })) },
                        react_1.default.createElement(eui_1.EuiContextMenuPanel, { watchedItemProps: ['icon', 'disabled'], items: this.getSortOptions() })),
                    this.props.showFilter && (react_1.default.createElement(eui_1.EuiPopover, { id: "addPanelFilterPopover", panelClassName: "euiFilterGroup__popoverPanel", panelPaddingSize: "none", isOpen: this.state.filterOpen, closePopover: () => this.setState({ filterOpen: false }), button: react_1.default.createElement(eui_1.EuiFilterButton, { onClick: () => this.setState(({ filterOpen }) => ({
                                filterOpen: !filterOpen,
                            })), iconType: "arrowDown", "data-test-subj": "savedObjectFinderFilterButton", isSelected: this.state.filterOpen, numFilters: this.props.savedObjectMetaData.length, hasActiveFilters: this.state.filteredTypes.length > 0, numActiveFilters: this.state.filteredTypes.length }, i18n_1.i18n.translate('savedObjects.finder.filterButtonLabel', {
                            defaultMessage: 'Types',
                        })) },
                        react_1.default.createElement(eui_1.EuiContextMenuPanel, { watchedItemProps: ['icon', 'disabled'], items: this.props.savedObjectMetaData.map((metaData) => (react_1.default.createElement(eui_1.EuiContextMenuItem, { key: metaData.type, disabled: !availableSavedObjectMetaData.includes(metaData), icon: this.state.filteredTypes.includes(metaData.type) ? 'check' : 'empty', "data-test-subj": `savedObjectFinderFilter-${metaData.type}`, onClick: () => {
                                    this.setState(({ filteredTypes }) => ({
                                        filteredTypes: filteredTypes.includes(metaData.type)
                                            ? filteredTypes.filter((t) => t !== metaData.type)
                                            : [...filteredTypes, metaData.type],
                                        page: 0,
                                    }));
                                } }, metaData.name))) }))))),
            this.props.children ? react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, this.props.children) : null));
    }
    renderListing() {
        const items = this.state.items.length === 0 ? [] : this.getPageOfItems();
        const { onChoose, savedObjectMetaData } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.state.isFetchingItems && this.state.items.length === 0 && (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "center" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiSpacer, null),
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { "data-test-subj": "savedObjectFinderLoadingIndicator" })))),
            items.length > 0 ? (react_1.default.createElement(eui_1.EuiListGroup, { "data-test-subj": "savedObjectFinderItemList", maxWidth: false }, items.map((item) => {
                const currentSavedObjectMetaData = savedObjectMetaData.find((metaData) => metaData.type === item.type);
                const fullName = currentSavedObjectMetaData.getTooltipForSavedObject
                    ? currentSavedObjectMetaData.getTooltipForSavedObject(item.savedObject)
                    : `${item.title} (${currentSavedObjectMetaData.name})`;
                const iconType = (currentSavedObjectMetaData ||
                    {
                        getIconForSavedObject: () => 'document',
                    }).getIconForSavedObject(item.savedObject);
                return (react_1.default.createElement(eui_1.EuiListGroupItem, { key: item.id, iconType: iconType, label: item.title, onClick: onChoose
                        ? () => {
                            onChoose(item.id, item.type, fullName, item.savedObject);
                        }
                        : undefined, title: fullName, "data-test-subj": `savedObjectTitle${(item.title || '').split(' ').join('-')}` }));
            }))) : (!this.state.isFetchingItems && react_1.default.createElement(eui_1.EuiEmptyPrompt, { body: this.props.noItemsMessage })),
            this.getPageCount() > 1 &&
                (this.props.fixedPageSize ? (react_1.default.createElement(eui_1.EuiPagination, { activePage: this.state.page, pageCount: this.getPageCount(), onPageClick: (page) => {
                        this.setState({
                            page,
                        });
                    } })) : (react_1.default.createElement(eui_1.EuiTablePagination, { activePage: this.state.page, pageCount: this.getPageCount(), onChangePage: (page) => {
                        this.setState({
                            page,
                        });
                    }, onChangeItemsPerPage: (perPage) => {
                        this.setState({
                            perPage,
                        });
                    }, itemsPerPage: this.state.perPage, itemsPerPageOptions: [5, 10, 15, 25] })))));
    }
}
exports.SavedObjectFinderUi = SavedObjectFinderUi;
SavedObjectFinderUi.propTypes = {
    onChoose: prop_types_1.default.func,
    noItemsMessage: prop_types_1.default.node,
    savedObjectMetaData: prop_types_1.default.array.isRequired,
    initialPageSize: prop_types_1.default.oneOf([5, 10, 15, 25]),
    fixedPageSize: prop_types_1.default.number,
    showFilter: prop_types_1.default.bool,
};
const getSavedObjectFinder = (savedObject, uiSettings) => {
    return (props) => (react_1.default.createElement(SavedObjectFinderUi, Object.assign({}, props, { savedObjects: savedObject, uiSettings: uiSettings })));
};
exports.getSavedObjectFinder = getSavedObjectFinder;
