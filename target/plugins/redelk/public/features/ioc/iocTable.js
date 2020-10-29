"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOCTable = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_redux_1 = require("react-redux");
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const types_1 = require("../../types");
exports.IOCTable = ({ http }) => {
    const ioc = react_redux_1.useSelector((state) => state.ioc.ioc);
    const iocStatus = react_redux_1.useSelector((state) => state.ioc.status);
    const toolbarVisibility = {
        showColumnSelector: true,
        showStyleSelector: true,
        showSortSelector: true,
        showFullScreenSelector: false
    };
    const gridStyle = {
        border: 'all',
        fontSize: 's',
        cellPadding: 's',
        stripes: true,
        rowHover: 'highlight',
        header: 'shade',
    };
    const datagrid_columns = [
        {
            id: '_source.@timestamp',
            isSortable: true,
            displayAsText: 'Time',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "Time")),
            initialWidth: 180,
        },
        {
            id: '_index',
            displayAsText: 'Index',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "Index")),
            initialWidth: 120,
        },
        {
            id: '_source.ioc.type',
            displayAsText: 'IOC Type',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "IOC Type")),
            initialWidth: 80,
        },
        {
            id: '_source.file.name',
            displayAsText: 'File name',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "File name"))
        },
        {
            id: '_source.file.hash.md5',
            displayAsText: 'File hash',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "File hash")),
            initialWidth: 250,
        },
        {
            id: '_source.file.size',
            displayAsText: 'File size',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "File size")),
            initialWidth: 80,
        },
        {
            id: '_source.c2.message',
            displayAsText: 'C2 message',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "C2 message")),
            initialWidth: 300,
        },
        {
            id: '_source.user.name',
            displayAsText: 'Target user',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "Target user"))
        },
        {
            id: '_source.host.name',
            displayAsText: 'Target host',
            display: (react_1.default.createElement(react_1.default.Fragment, null, "Target host"))
        }
    ];
    // Column visibility
    const [visibleColumns, setVisibleColumns] = react_1.useState(() => datagrid_columns.map(({ id }) => id));
    const raw_data = ioc === undefined ? [] : ioc.hits.hits;
    const renderCellValue = react_1.useMemo(() => {
        return ({ rowIndex, columnId, setCellProps }) => {
            // useEffect(() => {
            //   // if (columnId === 'amount') {
            //   //   if (raw_data.hasOwnProperty(rowIndex)) {
            //   //     const numeric = parseFloat(
            //   //       raw_data[rowIndex][columnId].match(/\d+\.\d+/)[0],
            //   //       10
            //   //     );
            //   //     setCellProps({
            //   //       style: {
            //   //         backgroundColor: `rgba(0, 255, 0, ${numeric * 0.0002})`,
            //   //       },
            //   //     });
            //   //   }
            //   // }
            // }, [rowIndex, columnId, setCellProps]);
            // @ts-ignore
            return raw_data.hasOwnProperty(rowIndex) ? lodash_1.at(raw_data[rowIndex], columnId) : '';
        };
    }, [ioc]);
    return iocStatus == types_1.KbnCallStatus.pending ? (react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "xl" })) : (react_1.default.createElement(eui_1.EuiDataGrid, { columns: datagrid_columns, rowCount: raw_data.length, renderCellValue: renderCellValue, toolbarVisibility: toolbarVisibility, columnVisibility: { visibleColumns, setVisibleColumns }, "aria-labelledby": 'ioc-grid', gridStyle: gridStyle }));
};
