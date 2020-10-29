"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStateFromSavedQuery = void 0;
exports.clearStateFromSavedQuery = (queryService, setQueryStringState, defaultLanguage) => {
    queryService.filterManager.removeAll();
    setQueryStringState({
        query: '',
        language: defaultLanguage,
    });
};
