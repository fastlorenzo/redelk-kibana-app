"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSavedObject = exports.isErrorNonFatal = void 0;
const constants_1 = require("../../constants");
const create_source_1 = require("./create_source");
const check_for_duplicate_title_1 = require("./check_for_duplicate_title");
/**
 * @param error {Error} the error
 * @return {boolean}
 */
function isErrorNonFatal(error) {
    if (!error)
        return false;
    return error.message === constants_1.OVERWRITE_REJECTED || error.message === constants_1.SAVE_DUPLICATE_REJECTED;
}
exports.isErrorNonFatal = isErrorNonFatal;
/**
 * Saves this object.
 *
 * @param {string} [esType]
 * @param {SavedObject} [savedObject]
 * @param {SavedObjectConfig} [config]
 * @param {object} [options={}]
 * @property {boolean} [options.confirmOverwrite=false] - If true, attempts to create the source so it
 * can confirm an overwrite if a document with the id already exists.
 * @property {boolean} [options.isTitleDuplicateConfirmed=false] - If true, save allowed with duplicate title
 * @property {func} [options.onTitleDuplicate] - function called if duplicate title exists.
 * When not provided, confirm modal will be displayed asking user to confirm or cancel save.
 * @param {SavedObjectKibanaServices} [services]
 * @return {Promise}
 * @resolved {String} - The id of the doc
 */
async function saveSavedObject(savedObject, config, { confirmOverwrite = false, isTitleDuplicateConfirmed = false, onTitleDuplicate, } = {}, services) {
    const { savedObjectsClient, chrome } = services;
    const esType = config.type || '';
    const extractReferences = config.extractReferences;
    // Save the original id in case the save fails.
    const originalId = savedObject.id;
    // Read https://github.com/elastic/kibana/issues/9056 and
    // https://github.com/elastic/kibana/issues/9012 for some background into why this copyOnSave variable
    // exists.
    // The goal is to move towards a better rename flow, but since our users have been conditioned
    // to expect a 'save as' flow during a rename, we are keeping the logic the same until a better
    // UI/UX can be worked out.
    if (savedObject.copyOnSave) {
        delete savedObject.id;
    }
    // Here we want to extract references and set them within "references" attribute
    let { attributes, references } = savedObject._serialize();
    if (extractReferences) {
        ({ attributes, references } = extractReferences({ attributes, references }));
    }
    if (!references)
        throw new Error('References not returned from extractReferences');
    try {
        await check_for_duplicate_title_1.checkForDuplicateTitle(savedObject, isTitleDuplicateConfirmed, onTitleDuplicate, services);
        savedObject.isSaving = true;
        const resp = confirmOverwrite
            ? await create_source_1.createSource(attributes, savedObject, esType, savedObject.creationOpts({ references }), services)
            : await savedObjectsClient.create(esType, attributes, savedObject.creationOpts({ references, overwrite: true }));
        savedObject.id = resp.id;
        if (savedObject.showInRecentlyAccessed && savedObject.getFullPath) {
            chrome.recentlyAccessed.add(savedObject.getFullPath(), savedObject.title, String(savedObject.id));
        }
        savedObject.isSaving = false;
        savedObject.lastSavedTitle = savedObject.title;
        return savedObject.id;
    }
    catch (err) {
        savedObject.isSaving = false;
        savedObject.id = originalId;
        if (isErrorNonFatal(err)) {
            return '';
        }
        return Promise.reject(err);
    }
}
exports.saveSavedObject = saveSavedObject;
