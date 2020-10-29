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
exports.SavedQueryManagementComponent = void 0;
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const lodash_1 = require("lodash");
const saved_query_list_item_1 = require("./saved_query_list_item");
const perPage = 50;
function SavedQueryManagementComponent({ showSaveQuery, loadedSavedQuery, onSave, onSaveAsNew, onLoad, onClearSavedQuery, savedQueryService, }) {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const [savedQueries, setSavedQueries] = react_1.useState([]);
    const [count, setTotalCount] = react_1.useState(0);
    const [activePage, setActivePage] = react_1.useState(0);
    const cancelPendingListingRequest = react_1.useRef(() => { });
    react_1.useEffect(() => {
        const fetchCountAndSavedQueries = async () => {
            cancelPendingListingRequest.current();
            let requestGotCancelled = false;
            cancelPendingListingRequest.current = () => {
                requestGotCancelled = true;
            };
            const { total: savedQueryCount, queries: savedQueryItems, } = await savedQueryService.findSavedQueries('', perPage, activePage + 1);
            if (requestGotCancelled)
                return;
            const sortedSavedQueryItems = lodash_1.sortBy(savedQueryItems, 'attributes.title');
            setTotalCount(savedQueryCount);
            setSavedQueries(sortedSavedQueryItems);
        };
        if (isOpen) {
            fetchCountAndSavedQueries();
        }
    }, [isOpen, activePage, savedQueryService]);
    const handleTogglePopover = react_1.useCallback(() => setIsOpen((currentState) => !currentState), [
        setIsOpen,
    ]);
    const handleClosePopover = react_1.useCallback(() => setIsOpen(false), []);
    const handleSave = react_1.useCallback(() => {
        handleClosePopover();
        onSave();
    }, [handleClosePopover, onSave]);
    const handleSaveAsNew = react_1.useCallback(() => {
        handleClosePopover();
        onSaveAsNew();
    }, [handleClosePopover, onSaveAsNew]);
    const handleSelect = react_1.useCallback((savedQueryToSelect) => {
        handleClosePopover();
        onLoad(savedQueryToSelect);
    }, [handleClosePopover, onLoad]);
    const handleDelete = react_1.useCallback((savedQueryToDelete) => {
        const onDeleteSavedQuery = async (savedQuery) => {
            cancelPendingListingRequest.current();
            setSavedQueries(savedQueries.filter((currentSavedQuery) => currentSavedQuery.id !== savedQuery.id));
            if (loadedSavedQuery && loadedSavedQuery.id === savedQuery.id) {
                onClearSavedQuery();
            }
            await savedQueryService.deleteSavedQuery(savedQuery.id);
            setActivePage(0);
        };
        onDeleteSavedQuery(savedQueryToDelete);
        handleClosePopover();
    }, [handleClosePopover, loadedSavedQuery, onClearSavedQuery, savedQueries, savedQueryService]);
    const savedQueryDescriptionText = i18n_1.i18n.translate('data.search.searchBar.savedQueryDescriptionText', {
        defaultMessage: 'Save query text and filters that you want to use again.',
    });
    const noSavedQueriesDescriptionText = i18n_1.i18n.translate('data.search.searchBar.savedQueryNoSavedQueriesText', {
        defaultMessage: 'There are no saved queries.',
    }) +
        ' ' +
        savedQueryDescriptionText;
    const savedQueryPopoverTitleText = i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverTitleText', {
        defaultMessage: 'Saved Queries',
    });
    const goToPage = (pageNumber) => {
        setActivePage(pageNumber);
    };
    const savedQueryPopoverButton = (react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: handleTogglePopover, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverButtonText', {
            defaultMessage: 'See saved queries',
        }), title: i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverButtonText', {
            defaultMessage: 'See saved queries',
        }), "data-test-subj": "saved-query-management-popover-button" },
        react_1.default.createElement(eui_1.EuiIcon, { type: "save", className: "euiQuickSelectPopover__buttonText" }),
        react_1.default.createElement(eui_1.EuiIcon, { type: "arrowDown" })));
    const savedQueryRows = () => {
        const savedQueriesWithoutCurrent = savedQueries.filter((savedQuery) => {
            if (!loadedSavedQuery)
                return true;
            return savedQuery.id !== loadedSavedQuery.id;
        });
        const savedQueriesReordered = loadedSavedQuery && savedQueriesWithoutCurrent.length !== savedQueries.length
            ? [loadedSavedQuery, ...savedQueriesWithoutCurrent]
            : [...savedQueriesWithoutCurrent];
        return savedQueriesReordered.map((savedQuery) => (react_1.default.createElement(saved_query_list_item_1.SavedQueryListItem, { key: savedQuery.id, savedQuery: savedQuery, isSelected: !!loadedSavedQuery && loadedSavedQuery.id === savedQuery.id, onSelect: handleSelect, onDelete: handleDelete, showWriteOperations: !!showSaveQuery })));
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiPopover, { id: "savedQueryPopover", button: savedQueryPopoverButton, isOpen: isOpen, closePopover: handleClosePopover, anchorPosition: "downLeft", panelPaddingSize: "none", buffer: -8, ownFocus: true, repositionOnScroll: true },
            react_1.default.createElement("div", { className: "kbnSavedQueryManagement__popover", "data-test-subj": "saved-query-management-popover" },
                react_1.default.createElement(eui_1.EuiPopoverTitle, { id: 'savedQueryManagementPopoverTitle' }, savedQueryPopoverTitleText),
                savedQueries.length > 0 ? (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued", className: "kbnSavedQueryManagement__text" },
                        react_1.default.createElement("p", null, savedQueryDescriptionText)),
                    react_1.default.createElement("div", { className: "kbnSavedQueryManagement__listWrapper" },
                        react_1.default.createElement(eui_1.EuiListGroup, { flush: true, className: "kbnSavedQueryManagement__list", "aria-labelledby": 'savedQueryManagementPopoverTitle' }, savedQueryRows())),
                    react_1.default.createElement(eui_1.EuiPagination, { className: "kbnSavedQueryManagement__pagination", pageCount: Math.ceil(count / perPage), activePage: activePage, onPageClick: goToPage }))) : (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued", className: "kbnSavedQueryManagement__text" },
                        react_1.default.createElement("p", null, noSavedQueriesDescriptionText)),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }))),
                react_1.default.createElement(eui_1.EuiPopoverFooter, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "rowReverse", gutterSize: "s", alignItems: "center", justifyContent: "flexEnd", responsive: false, wrap: true },
                        showSaveQuery && loadedSavedQuery && (react_1.default.createElement(react_1.Fragment, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement(eui_1.EuiButton, { size: "s", fill: true, onClick: handleSave, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveChangesButtonAriaLabel', {
                                        defaultMessage: 'Save changes to {title}',
                                        values: { title: loadedSavedQuery.attributes.title },
                                    }), "data-test-subj": "saved-query-management-save-changes-button" }, i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveChangesButtonText', {
                                    defaultMessage: 'Save changes',
                                }))),
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement(eui_1.EuiButton, { size: "s", onClick: handleSaveAsNew, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveAsNewButtonAriaLabel', {
                                        defaultMessage: 'Save as new saved query',
                                    }), "data-test-subj": "saved-query-management-save-as-new-button" }, i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveAsNewButtonText', {
                                    defaultMessage: 'Save as new',
                                }))))),
                        showSaveQuery && !loadedSavedQuery && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButton, { size: "s", fill: true, onClick: handleSave, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveButtonAriaLabel', { defaultMessage: 'Save a new saved query' }), "data-test-subj": "saved-query-management-save-button" }, i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverSaveButtonText', {
                                defaultMessage: 'Save current query',
                            })))),
                        react_1.default.createElement(eui_1.EuiFlexItem, null),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, loadedSavedQuery && (react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", flush: "left", onClick: onClearSavedQuery, "aria-label": i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverClearButtonAriaLabel', { defaultMessage: 'Clear current saved query' }), "data-test-subj": "saved-query-management-clear-button" }, i18n_1.i18n.translate('data.search.searchBar.savedQueryPopoverClearButtonText', {
                            defaultMessage: 'Clear',
                        }))))))))));
}
exports.SavedQueryManagementComponent = SavedQueryManagementComponent;
