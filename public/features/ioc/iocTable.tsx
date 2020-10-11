import React, {ReactElement, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {at} from 'lodash';
// import moment from 'moment';
import {
  EuiDataGrid,
  EuiDataGridCellValueElementProps,
  EuiDataGridColumn,
  EuiDataGridStyle,
  EuiDataGridToolBarVisibilityOptions,
  EuiLoadingSpinner,
} from '@elastic/eui';

import {CoreStart} from 'kibana/public';
import {EsAnswerIOC, KbnCallStatus, RedELKState} from '../../types';
import {fetchAllIOC} from './iocSlice';

// import { IOCState } from './types';

interface IOCTableDeps {
  http: CoreStart['http'];
}

export const IOCTable = ({http}: IOCTableDeps) => {

  const ioc: (EsAnswerIOC | undefined) = useSelector((state: RedELKState) => state.ioc.ioc);
  const iocStatus: KbnCallStatus = useSelector((state: RedELKState) => state.ioc.status);

  const dispatch = useDispatch();

  // const sorting: EuiDataGridSorting = {
  //   sort: {
  //     field: '_source.@timestamp',
  //     direction: 'desc',
  //   },
  // };

  // const columns = [
  //   {
  //     field: '_source.@timestamp',
  //     name: 'Time',
  //     sortable: true,
  //     render: (timestamp: string) => {
  //       const ts = new moment(timestamp);
  //       return (ts.toISOString(true))
  //     }
  //   },
  //   {
  //     field: '_index',
  //     name: 'Index',
  //     sortable: true
  //   },
  //   {
  //     field: '_source.ioc.type',
  //     name: 'IOC Type',
  //     sortable: true
  //   },
  //   {
  //     field: '_source.file.name',
  //     name: 'File name',
  //     sortable: true
  //   },
  //   {
  //     field: '_source.file.hash.md5',
  //     name: 'File hash',
  //     sortable: true
  //   },
  //   {
  //     field: '_source.file.size',
  //     name: 'File size (bytes)',
  //     sortable: true
  //   }
  // ];

  const toolbarVisibility: EuiDataGridToolBarVisibilityOptions = {
    showColumnSelector: true,
    showStyleSelector: true,
    showSortSelector: true,
    showFullScreenSelector: false
  };
  const gridStyle: EuiDataGridStyle = {
    border: 'all',
    fontSize: 's',
    cellPadding: 's',
    stripes: true,
    rowHover: 'highlight',
    header: 'shade',
  };
  const datagrid_columns: EuiDataGridColumn[] = [
    {
      id: '_source.@timestamp',
      isSortable: true,
      displayAsText: 'Time',
      display: (<>Time</>),
      initialWidth: 180,
    },
    {
      id: '_index',
      displayAsText: 'Index',
      display: (<>Index</>),
      initialWidth: 120,
    },
    {
      id: '_source.ioc.type',
      displayAsText: 'IOC Type',
      display: (<>IOC Type</>),
      initialWidth: 80,
    },
    {
      id: '_source.file.name',
      displayAsText: 'File name',
      display: (<>File name</>)
    },
    {
      id: '_source.file.hash.md5',
      displayAsText: 'File hash',
      display: (<>File hash</>),
      initialWidth: 250,
    },
    {
      id: '_source.file.size',
      displayAsText: 'File size',
      display: (<>File size</>),
      initialWidth: 80,
    },
    {
      id: '_source.c2.message',
      displayAsText: 'C2 message',
      display: (<>C2 message</>),
      initialWidth: 300,
    },
    {
      id: '_source.user.name',
      displayAsText: 'Target user',
      display: (<>Target user</>)
    },
    {
      id: '_source.host.name',
      displayAsText: 'Target host',
      display: (<>Target host</>)
    }
  ];

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(() =>
    datagrid_columns.map(({id}) => id)
  ); // initialize to the full set of columns

  const raw_data = ioc === undefined ? [] : ioc.hits.hits;
  const renderCellValue = useMemo(() => {
    return ({rowIndex, columnId, setCellProps}: EuiDataGridCellValueElementProps): ReactElement => {
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
      return raw_data.hasOwnProperty(rowIndex) ? at(raw_data[rowIndex], columnId) : '';
    };
  }, [ioc]);

  useEffect(() => {
    if (iocStatus === KbnCallStatus.idle) {
      dispatch(fetchAllIOC({http}));
    }
  }, [iocStatus, dispatch])

  return iocStatus == KbnCallStatus.pending ? (
    <EuiLoadingSpinner size="xl"/>
  ) : (
    <EuiDataGrid
      columns={datagrid_columns}
      rowCount={raw_data.length}
      renderCellValue={renderCellValue}
      toolbarVisibility={toolbarVisibility}
      columnVisibility={{visibleColumns, setVisibleColumns}}
      aria-labelledby={'ioc-grid'}
      gridStyle={gridStyle}
    />
  )
  // return (
  //   <EuiInMemoryTable
  //     items={ioc && ioc.hits && ioc.hits.hits ? ioc.hits.hits : []}
  //     tableLayout='auto'
  //     sorting={sorting}
  //     columns={columns}
  //     loading={iocStatus !== KbnCallStatus.success}
  //   />
  // )

}
