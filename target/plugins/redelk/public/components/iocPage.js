"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOCPage = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const iocTable_1 = require("../features/ioc/iocTable");
const eui_1 = require("@elastic/eui");
const addIocForm_1 = require("../features/ioc/addIocForm");
exports.IOCPage = ({ basename, notifications, http, navigation, data, showAddIOCFlyout, setIOCFlyoutVisible, showTopNav }) => {
    let addIOCFlyout;
    if (showAddIOCFlyout) {
        addIOCFlyout = (react_1.default.createElement(eui_1.EuiFlyout, { size: "m", onClose: () => setIOCFlyoutVisible(false), "aria-labelledby": "flyoutTitle" },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                    react_1.default.createElement("h2", { id: "flyoutTitle" }, "Add an IOC"))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                react_1.default.createElement(addIocForm_1.AddIOCForm, { http: http, callback: () => setIOCFlyoutVisible(false) }))));
    }
    const topNavMenu = '';
    react_1.useEffect(() => showTopNav(true), []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        topNavMenu,
        react_1.default.createElement(eui_1.EuiPage, null,
            addIOCFlyout,
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiPageContent, null,
                    react_1.default.createElement(eui_1.EuiPageContentHeader, null,
                        react_1.default.createElement(eui_1.EuiTitle, null,
                            react_1.default.createElement("h2", null, "IOC manual ingestion"))),
                    react_1.default.createElement(eui_1.EuiPageContentBody, null,
                        react_1.default.createElement(eui_1.EuiText, null,
                            react_1.default.createElement("p", null, "In this page you can manually ingest IOC in RedELK.")),
                        react_1.default.createElement(eui_1.EuiSpacer, null),
                        react_1.default.createElement(iocTable_1.IOCTable, { http: http })))))));
};
