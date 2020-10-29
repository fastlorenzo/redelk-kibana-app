"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForDuplicateTitle = void 0;
const find_object_by_title_1 = require("./find_object_by_title");
const constants_1 = require("../../constants");
const display_duplicate_title_confirm_modal_1 = require("./display_duplicate_title_confirm_modal");
/**
 * check for an existing SavedObject with the same title in ES
 * returns Promise<true> when it's no duplicate, or the modal displaying the warning
 * that's there's a duplicate is confirmed, else it returns a rejected Promise<ErrorMsg>
 * @param savedObject
 * @param isTitleDuplicateConfirmed
 * @param onTitleDuplicate
 * @param services
 */
async function checkForDuplicateTitle(savedObject, isTitleDuplicateConfirmed, onTitleDuplicate, services) {
    const { savedObjectsClient, overlays } = services;
    // Don't check for duplicates if user has already confirmed save with duplicate title
    if (isTitleDuplicateConfirmed) {
        return true;
    }
    // Don't check if the user isn't updating the title, otherwise that would become very annoying to have
    // to confirm the save every time, except when copyOnSave is true, then we do want to check.
    if (savedObject.title === savedObject.lastSavedTitle && !savedObject.copyOnSave) {
        return true;
    }
    const duplicate = await find_object_by_title_1.findObjectByTitle(savedObjectsClient, savedObject.getEsType(), savedObject.title);
    if (!duplicate || duplicate.id === savedObject.id) {
        return true;
    }
    if (onTitleDuplicate) {
        onTitleDuplicate();
        return Promise.reject(new Error(constants_1.SAVE_DUPLICATE_REJECTED));
    }
    // TODO: make onTitleDuplicate a required prop and remove UI components from this class
    // Need to leave here until all users pass onTitleDuplicate.
    return display_duplicate_title_confirm_modal_1.displayDuplicateTitleConfirmModal(savedObject, overlays);
}
exports.checkForDuplicateTitle = checkForDuplicateTitle;
