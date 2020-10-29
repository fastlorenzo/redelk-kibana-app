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
exports.TableListView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const util_1 = require("../util");
// saved object client does not support sorting by title because title is only mapped as analyzed
// the legacy implementation got around this by pulling `listingLimit` items and doing client side sorting
// and not supporting server-side paging.
// This component does not try to tackle these problems (yet) and is just feature matching the legacy component
// TODO support server side sorting/paging once title and description are sortable on the server.
class TableListView extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.pagination = {};
        this._isMounted = false;
        this.debouncedFetch = lodash_1.debounce(async (filter) => {
            try {
                const response = await this.props.findItems(filter);
                if (!this._isMounted) {
                    return;
                }
                // We need this check to handle the case where search results come back in a different
                // order than they were sent out. Only load results for the most recent search.
                // Also, in case filter is empty, items are being pre-sorted alphabetically.
                if (filter === this.state.filter) {
                    this.setState({
                        hasInitialFetchReturned: true,
                        isFetchingItems: false,
                        items: !filter ? lodash_1.sortBy(response.hits, 'title') : response.hits,
                        totalItems: response.total,
                        showLimitError: response.total > this.props.listingLimit,
                    });
                }
            }
            catch (fetchError) {
                this.setState({
                    hasInitialFetchReturned: true,
                    isFetchingItems: false,
                    items: [],
                    totalItems: 0,
                    showLimitError: false,
                    fetchError,
                });
            }
        }, 300);
        this.fetchItems = () => {
            this.setState({
                isFetchingItems: true,
                fetchError: undefined,
            }, this.debouncedFetch.bind(null, this.state.filter));
        };
        this.deleteSelectedItems = async () => {
            if (this.state.isDeletingItems || !this.props.deleteItems) {
                return;
            }
            this.setState({
                isDeletingItems: true,
            });
            try {
                const itemsById = lodash_1.keyBy(this.state.items, 'id');
                await this.props.deleteItems(this.state.selectedIds.map((id) => itemsById[id]));
            }
            catch (error) {
                this.props.toastNotifications.addDanger({
                    title: util_1.toMountPoint(react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.unableToDeleteDangerMessage", defaultMessage: "Unable to delete {entityName}(s)", values: { entityName: this.props.entityName } })),
                    text: `${error}`,
                });
            }
            this.fetchItems();
            this.setState({
                isDeletingItems: false,
                selectedIds: [],
            });
            this.closeDeleteModal();
        };
        this.closeDeleteModal = () => {
            this.setState({ showDeleteModal: false });
        };
        this.openDeleteModal = () => {
            this.setState({ showDeleteModal: true });
        };
        this.pagination = {
            initialPageIndex: 0,
            initialPageSize: props.initialPageSize,
            pageSizeOptions: lodash_1.uniq([10, 20, 50, props.initialPageSize]).sort(),
        };
        this.state = {
            items: [],
            totalItems: 0,
            hasInitialFetchReturned: false,
            isFetchingItems: false,
            isDeletingItems: false,
            showDeleteModal: false,
            showLimitError: false,
            filter: props.initialFilter,
            selectedIds: [],
        };
    }
    UNSAFE_componentWillMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.debouncedFetch.cancel();
    }
    componentDidMount() {
        this.fetchItems();
    }
    setFilter({ queryText }) {
        // If the user is searching, we want to clear the sort order so that
        // results are ordered by Elasticsearch's relevance.
        this.setState({
            filter: queryText,
        }, this.fetchItems);
    }
    hasNoItems() {
        if (!this.state.isFetchingItems && this.state.items.length === 0 && !this.state.filter) {
            return true;
        }
        return false;
    }
    renderConfirmDeleteModal() {
        let deleteButton = (react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteSelectedItemsConfirmModal.confirmButtonLabel", defaultMessage: "Delete" }));
        if (this.state.isDeletingItems) {
            deleteButton = (react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteSelectedItemsConfirmModal.confirmButtonLabelDeleting", defaultMessage: "Deleting" }));
        }
        return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
            react_1.default.createElement(eui_1.EuiConfirmModal, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteSelectedConfirmModal.title", defaultMessage: "Delete {itemCount} {entityName}?", values: {
                        itemCount: this.state.selectedIds.length,
                        entityName: this.state.selectedIds.length === 1
                            ? this.props.entityName
                            : this.props.entityNamePlural,
                    } }), buttonColor: "danger", onCancel: this.closeDeleteModal, onConfirm: this.deleteSelectedItems, cancelButtonText: react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteSelectedItemsConfirmModal.cancelButtonLabel", defaultMessage: "Cancel" }), confirmButtonText: deleteButton, defaultFocusedButton: "cancel" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteConfirmModalDescription", defaultMessage: "You can't recover deleted {entityNamePlural}.", values: { entityNamePlural: this.props.entityNamePlural } })))));
    }
    renderListingLimitWarning() {
        if (this.state.showLimitError) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.listingLimitExceededTitle", defaultMessage: "Listing limit exceeded" }), color: "warning", iconType: "help" },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.listingLimitExceededDescription", defaultMessage: "You have {totalItems} {entityNamePlural}, but your {listingLimitText} setting prevents\n                the table below from displaying more than {listingLimitValue}. You can change this setting under {advancedSettingsLink}.", values: {
                                entityNamePlural: this.props.entityNamePlural,
                                totalItems: this.state.totalItems,
                                listingLimitValue: this.props.listingLimit,
                                listingLimitText: react_1.default.createElement("strong", null, "listingLimit"),
                                advancedSettingsLink: (react_1.default.createElement(eui_1.EuiLink, { href: "#/management/kibana/settings" },
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.listingLimitExceeded.advancedSettingsLinkText", defaultMessage: "Advanced Settings" }))),
                            } }))),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
        }
    }
    renderFetchError() {
        if (this.state.fetchError) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.fetchErrorTitle", defaultMessage: "Fetching listing failed" }), color: "danger", iconType: "alert" },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.fetchErrorDescription", defaultMessage: "The {entityName} listing could not be fetched: {message}.", values: {
                                entityName: this.props.entityName,
                                message: this.state.fetchError.body?.message || this.state.fetchError.message,
                            } }))),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
        }
    }
    renderNoItemsMessage() {
        if (this.props.noItemsFragment) {
            return this.props.noItemsFragment;
        }
        else {
            return (react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.noAvailableItemsMessage", defaultMessage: "No {entityNamePlural} available.", values: { entityNamePlural: this.props.entityNamePlural } }));
        }
    }
    renderToolsLeft() {
        const selection = this.state.selectedIds;
        if (selection.length === 0) {
            return;
        }
        const onClick = () => {
            this.openDeleteModal();
        };
        return (react_1.default.createElement(eui_1.EuiButton, { color: "danger", iconType: "trash", onClick: onClick, "data-test-subj": "deleteSelectedItems" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.deleteButtonMessage", defaultMessage: "Delete {itemCount} {entityName}", values: {
                    itemCount: selection.length,
                    entityName: selection.length === 1 ? this.props.entityName : this.props.entityNamePlural,
                } })));
    }
    renderTable() {
        const selection = this.props.deleteItems
            ? {
                onSelectionChange: (obj) => {
                    this.setState({
                        selectedIds: obj
                            .map((item) => item.id)
                            .filter((id) => Boolean(id)),
                    });
                },
            }
            : undefined;
        const actions = [
            {
                name: i18n_1.i18n.translate('kibana-react.tableListView.listing.table.editActionName', {
                    defaultMessage: 'Edit',
                }),
                description: i18n_1.i18n.translate('kibana-react.tableListView.listing.table.editActionDescription', {
                    defaultMessage: 'Edit',
                }),
                icon: 'pencil',
                type: 'icon',
                onClick: this.props.editItem,
            },
        ];
        const search = {
            onChange: this.setFilter.bind(this),
            toolsLeft: this.renderToolsLeft(),
            defaultQuery: this.state.filter,
            box: {
                incremental: true,
            },
        };
        const columns = this.props.tableColumns.slice();
        if (this.props.editItem) {
            columns.push({
                name: i18n_1.i18n.translate('kibana-react.tableListView.listing.table.actionTitle', {
                    defaultMessage: 'Actions',
                }),
                width: '100px',
                actions,
            });
        }
        const noItemsMessage = (react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.noMatchedItemsMessage", defaultMessage: "No {entityNamePlural} matched your search.", values: { entityNamePlural: this.props.entityNamePlural } }));
        return (react_1.default.createElement(eui_1.EuiInMemoryTable, { itemId: "id", items: this.state.items, columns: columns, pagination: this.pagination, loading: this.state.isFetchingItems, message: noItemsMessage, selection: selection, search: search, sorting: true, "data-test-subj": "itemsInMemTable" }));
    }
    renderListingOrEmptyState() {
        if (!this.state.fetchError && this.hasNoItems()) {
            return this.renderNoItemsMessage();
        }
        return this.renderListing();
    }
    renderListing() {
        let createButton;
        if (this.props.createItem) {
            createButton = (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { onClick: this.props.createItem, "data-test-subj": "newItemButton", iconType: "plusInCircle", fill: true },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "kibana-react.tableListView.listing.createNewItemButtonLabel", defaultMessage: "Create {entityName}", values: { entityName: this.props.entityName } }))));
        }
        return (react_1.default.createElement("div", null,
            this.state.showDeleteModal && this.renderConfirmDeleteModal(),
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "flexEnd", "data-test-subj": "top-nav" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiTitle, { size: "l" },
                        react_1.default.createElement("h1", { id: this.props.headingId }, this.props.tableListTitle))),
                createButton),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            this.renderListingLimitWarning(),
            this.renderFetchError(),
            this.renderTable()));
    }
    renderPageContent() {
        if (!this.state.hasInitialFetchReturned) {
            return;
        }
        return (react_1.default.createElement(eui_1.EuiPageContent, { horizontalPosition: "center" }, this.renderListingOrEmptyState()));
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiPage, { "data-test-subj": this.props.entityName + 'LandingPage', className: "itemListing__page", restrictWidth: true },
            react_1.default.createElement(eui_1.EuiPageBody, { "aria-labelledby": this.state.hasInitialFetchReturned ? this.props.headingId : undefined }, this.renderPageContent())));
    }
}
exports.TableListView = TableListView;
