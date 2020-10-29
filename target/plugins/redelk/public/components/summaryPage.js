"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryPage = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_router_dom_1 = require("react-router-dom");
exports.SummaryPage = ({ basename, notifications, http, navigation, showTopNav }) => {
    react_1.useEffect(() => showTopNav(false), []);
    return (react_1.default.createElement(eui_1.EuiPage, null,
        react_1.default.createElement(eui_1.EuiPageBody, null,
            react_1.default.createElement(eui_1.EuiPageHeader, null,
                react_1.default.createElement(eui_1.EuiTitle, { size: "l" },
                    react_1.default.createElement("h1", null, "Overview"))),
            react_1.default.createElement(eui_1.EuiPageContent, null,
                react_1.default.createElement("p", null, "Summary dashboard"),
                react_1.default.createElement(react_router_dom_1.Link, { to: '/ioc' }, "IOC")))));
};
