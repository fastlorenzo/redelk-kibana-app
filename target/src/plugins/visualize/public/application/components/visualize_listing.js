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
exports.VisualizeListing = void 0;
const tslib_1 = require("tslib");
require("./visualize_listing.scss");
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_use_1 = require("react-use");
const react_router_dom_1 = require("react-router-dom");
const public_1 = require("../../../../kibana_react/public");
const public_2 = require("../../../../visualizations/public");
const visualize_constants_1 = require("../visualize_constants");
const utils_1 = require("../utils");
exports.VisualizeListing = () => {
    const { services: { application, chrome, history, savedVisualizations, toastNotifications, visualizations, savedObjects, savedObjectsPublic, uiSettings, visualizeCapabilities, }, } = public_1.useKibana();
    const { pathname } = react_router_dom_1.useLocation();
    const closeNewVisModal = react_1.useRef(() => { });
    const listingLimit = savedObjectsPublic.settings.getListingLimit();
    react_1.useEffect(() => {
        if (pathname === '/new') {
            // In case the user navigated to the page via the /visualize/new URL we start the dialog immediately
            closeNewVisModal.current = visualizations.showNewVisModal({
                onClose: () => {
                    // In case the user came via a URL to this page, change the URL to the regular landing page URL after closing the modal
                    history.push(visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH);
                },
            });
        }
        else {
            // close modal window if exists
            closeNewVisModal.current();
        }
    }, [history, pathname, visualizations]);
    react_use_1.useMount(() => {
        chrome.setBreadcrumbs([
            {
                text: i18n_1.i18n.translate('visualize.visualizeListingBreadcrumbsTitle', {
                    defaultMessage: 'Visualize',
                }),
            },
        ]);
        chrome.docTitle.change(i18n_1.i18n.translate('visualize.listingPageTitle', { defaultMessage: 'Visualize' }));
    });
    react_use_1.useUnmount(() => closeNewVisModal.current());
    const createNewVis = react_1.useCallback(() => {
        closeNewVisModal.current = visualizations.showNewVisModal();
    }, [visualizations]);
    const editItem = react_1.useCallback(({ editUrl, editApp }) => {
        if (editApp) {
            application.navigateToApp(editApp, { path: editUrl });
            return;
        }
        // for visualizations the edit and view URLs are the same
        history.push(editUrl);
    }, [application, history]);
    const noItemsFragment = react_1.useMemo(() => utils_1.getNoItemsMessage(createNewVis), [createNewVis]);
    const tableColumns = react_1.useMemo(() => utils_1.getTableColumns(application, history), [application, history]);
    const fetchItems = react_1.useCallback((filter) => {
        const isLabsEnabled = uiSettings.get(public_2.VISUALIZE_ENABLE_LABS_SETTING);
        return savedVisualizations
            .findListItems(filter, listingLimit)
            .then(({ total, hits }) => ({
            total,
            hits: hits.filter((result) => isLabsEnabled || result.type.stage !== 'experimental'),
        }));
    }, [listingLimit, savedVisualizations, uiSettings]);
    const deleteItems = react_1.useCallback(async (selectedItems) => {
        await Promise.all(selectedItems.map((item) => savedObjects.client.delete(item.savedObjectType, item.id))).catch((error) => {
            toastNotifications.addError(error, {
                title: i18n_1.i18n.translate('visualize.visualizeListingDeleteErrorTitle', {
                    defaultMessage: 'Error deleting visualization',
                }),
            });
        });
    }, [savedObjects.client, toastNotifications]);
    return (react_1.default.createElement(public_1.TableListView, { headingId: "visualizeListingHeading", 
        // we allow users to create visualizations even if they can't save them
        // for data exploration purposes
        createItem: createNewVis, findItems: fetchItems, deleteItems: visualizeCapabilities.delete ? deleteItems : undefined, editItem: visualizeCapabilities.save ? editItem : undefined, tableColumns: tableColumns, listingLimit: listingLimit, initialPageSize: savedObjectsPublic.settings.getPerPage(), initialFilter: '', noItemsFragment: noItemsFragment, entityName: i18n_1.i18n.translate('visualize.listing.table.entityName', {
            defaultMessage: 'visualization',
        }), entityNamePlural: i18n_1.i18n.translate('visualize.listing.table.entityNamePlural', {
            defaultMessage: 'visualizations',
        }), tableListTitle: i18n_1.i18n.translate('visualize.listing.table.listTitle', {
            defaultMessage: 'Visualizations',
        }), toastNotifications: toastNotifications }));
};
