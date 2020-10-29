"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderApp = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const redux_thunk_1 = tslib_1.__importDefault(require("redux-thunk"));
const toolkit_1 = require("@reduxjs/toolkit");
const app_1 = require("./components/app");
const reducers_1 = tslib_1.__importDefault(require("./reducers"));
const kbnApiMiddleware_1 = tslib_1.__importDefault(require("./middlewares/kbnApiMiddleware"));
const public_1 = require("../../../src/plugins/kibana_react/public");
const public_2 = require("../../../src/plugins/kibana_utils/public");
exports.renderApp = (core, appDeps, { appBasePath, element, history }) => {
    const { notifications, http } = core;
    const { navigation, data } = appDeps;
    const store = toolkit_1.configureStore({
        reducer: reducers_1.default,
        middleware: [redux_thunk_1.default, kbnApiMiddleware_1.default({ notifications, http })],
        devTools: true
    });
    const kbnUrlStateStorage = public_2.createKbnUrlStateStorage({ useHash: false, history });
    react_dom_1.default.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
        react_1.default.createElement(public_1.KibanaContextProvider, { services: {
                ...core,
                ...appDeps
            } },
            react_1.default.createElement(app_1.RedelkApp, { basename: appBasePath, navigation: navigation, core: core, data: data, history: history, kbnUrlStateStorage: kbnUrlStateStorage }))), element);
    return () => react_dom_1.default.unmountComponentAtNode(element);
};
