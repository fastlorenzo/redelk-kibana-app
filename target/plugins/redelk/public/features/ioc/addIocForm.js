"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIOCForm = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const moment_1 = tslib_1.__importDefault(require("moment"));
const eui_1 = require("@elastic/eui");
const iocSlice_1 = require("./iocSlice");
exports.AddIOCForm = ({ http, callback }) => {
    const md5Regexp = /^[a-fA-F0-9]{32}$/;
    const dispatch = react_redux_1.useDispatch();
    const [type, setType] = react_1.useState('');
    const [timestamp, setTimestamp] = react_1.useState(moment_1.default());
    const [fileName, setFileName] = react_1.useState('');
    const [fileHash, setFileHash] = react_1.useState('');
    const [fileSize, setFileSize] = react_1.useState('');
    const [c2Message, setC2Message] = react_1.useState('');
    const [userName, setUserName] = react_1.useState('');
    const [hostName, setHostName] = react_1.useState('');
    const fileHashErrors = ['Invalid file hash'];
    const isFileHashValid = md5Regexp.test(fileHash);
    const isFileNameValid = typeof fileName === 'string' && fileName.length > 0;
    const fileNameErrors = [!isFileNameValid ? 'File name is required' : ''];
    const handleFormSubmit = (e) => {
        const payload = {
            '@timestamp': timestamp.toISOString(),
            rtops: {
                type: type
            },
            file: {
                name: fileName,
                size: fileSize,
                hash: {
                    md5: fileHash
                }
            },
            c2: {
                message: c2Message
            },
            host: {
                name: hostName
            },
            user: {
                name: userName
            }
        };
        dispatch(iocSlice_1.createIOC({ http, payload }));
        e.preventDefault();
        callback();
    };
    const handleTypeChange = (e) => {
        setType(e.target.value);
    };
    // Common to all IOC types
    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };
    const handleHostNameChange = (e) => {
        setHostName(e.target.value);
    };
    const handleC2MessageChange = (e) => {
        setC2Message(e.target.value);
    };
    const handleTimestampChange = (date) => {
        setTimestamp(date);
    };
    // File
    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };
    const handleFileHashChange = (e) => {
        setFileHash(e.target.value);
    };
    const handleFileSizeChange = (e) => {
        setFileSize(e.target.value);
    };
    const fileForm = type === 'file' ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFormRow, { label: "Timestamp (required)", helpText: "When has the IOC been seen?" },
            react_1.default.createElement(eui_1.EuiDatePicker, { showTimeSelect: true, selected: timestamp, onChange: handleTimestampChange, timeIntervals: 1 })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "File name (required)", helpText: "Name of the file related to the IOC.", error: fileNameErrors, isInvalid: !isFileNameValid },
            react_1.default.createElement(eui_1.EuiFieldText, { name: "fileName", onChange: handleFileNameChange, isInvalid: !isFileNameValid })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "File hash (MD5)", helpText: "MD5 hash of the file related to the IOC.", error: fileHashErrors, isInvalid: !isFileHashValid },
            react_1.default.createElement(eui_1.EuiFieldText, { name: "fileHash", onChange: handleFileHashChange, isInvalid: !isFileHashValid })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "File size", helpText: "Size of the file related to the IOC (in bytes)." },
            react_1.default.createElement(eui_1.EuiFieldNumber, { name: "fileSize", onChange: handleFileSizeChange })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "User name", helpText: "Optional name of the target user where the IOC occurred." },
            react_1.default.createElement(eui_1.EuiFieldText, { name: "userName", onChange: handleUserNameChange })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "Host name", helpText: "Optional name of the target host where the IOC occurred." },
            react_1.default.createElement(eui_1.EuiFieldText, { name: "hostName", onChange: handleHostNameChange })),
        react_1.default.createElement(eui_1.EuiFormRow, { label: "C2 Message", helpText: "Optional message that will be populated in the `c2.message` field." },
            react_1.default.createElement(eui_1.EuiFieldText, { name: "c2Message", onChange: handleC2MessageChange })))) : '';
    return (react_1.default.createElement(eui_1.EuiForm, { component: "form", onSubmit: handleFormSubmit },
        react_1.default.createElement(eui_1.EuiFormRow, { label: "IOC Type", helpText: "Select the type of IOC to ingest." },
            react_1.default.createElement(eui_1.EuiSelect, { hasNoInitialSelection: true, onChange: handleTypeChange, options: [
                    { value: '', text: '' },
                    { value: 'file', text: 'File' },
                    { value: 'service', text: 'Service' },
                    { value: 'domain', text: 'Domain' },
                    { value: 'ip', text: 'IP address' },
                ] })),
        react_1.default.createElement(eui_1.EuiSpacer, null),
        fileForm,
        react_1.default.createElement(eui_1.EuiButton, { type: "submit", fill: true, isDisabled: type === undefined }, "Add IOC")));
};
