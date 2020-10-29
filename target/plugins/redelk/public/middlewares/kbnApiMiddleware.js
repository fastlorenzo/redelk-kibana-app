"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kbnApi = ({ notifications, http }) => {
    const kbnApiMiddleware = ({ dispatch, getState }) => (next) => action => {
        //console.log('Called kbnApiMiddleware');
        //console.log(http);
        switch (action.type) {
            case "ioc/createIOC/fulfilled":
                // Wait 3 seconds for the data to be ingested before fetching all IOCs again.
                //setTimeout(() => dispatch(fetchAllIOC({http})), 3000);
                //dispatch(fetchAllIOC({http}));
                notifications.toasts.addSuccess('IOC successfully created');
                return next(action);
                break;
            default:
                console.log(action.type);
        }
        return next(action);
    };
    return kbnApiMiddleware;
};
exports.default = kbnApi;
