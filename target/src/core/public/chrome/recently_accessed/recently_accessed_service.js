"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentlyAccessedService = void 0;
const persisted_log_1 = require("./persisted_log");
const create_log_key_1 = require("./create_log_key");
/** @internal */
class RecentlyAccessedService {
    async start({ http }) {
        const logKey = await create_log_key_1.createLogKey('recentlyAccessed', http.basePath.get());
        const history = new persisted_log_1.PersistedLog(logKey, {
            maxLength: 20,
            isEqual: (oldItem, newItem) => oldItem.id === newItem.id,
        });
        return {
            /** Adds a new item to the history. */
            add: (link, label, id) => {
                history.add({
                    link,
                    label,
                    id,
                });
            },
            /** Gets the current array of history items. */
            get: () => history.get(),
            /** Gets an observable of the current array of history items. */
            get$: () => history.get$(),
        };
    }
}
exports.RecentlyAccessedService = RecentlyAccessedService;
