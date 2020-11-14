/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import React, {ReactElement, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {at} from 'lodash';
import {
  EuiDataGrid,
  EuiDataGridCellValueElementProps,
  EuiDataGridColumn,
  EuiDataGridStyle,
  EuiDataGridToolBarVisibilityOptions,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
} from '@elastic/eui';

import {KbnCallStatus} from '../../types';
import {getRtopsFilteredIOC, getRtopsStatus} from "../../redux/selectors";

export const IOCTable = () => {

  const ioc = useSelector(getRtopsFilteredIOC);
  const rtopsStatus = useSelector(getRtopsStatus);

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
    },
    {
      id: '_index',
      displayAsText: 'Index',
      display: (<>Index</>),
      initialWidth: 110
    },
    {
      id: '_source.ioc.type',
      displayAsText: 'IOC Type',
      display: (<>IOC Type</>),
      initialWidth: 80
    },
    {
      id: '_source.c2.message',
      displayAsText: 'C2 message',
      display: (<>C2 message</>),
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
    },
    {
      id: '_source.file.size',
      displayAsText: 'File size',
      display: (<>File size</>),
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
  );

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
      return ioc.hasOwnProperty(rowIndex) ? at(ioc[rowIndex], columnId) : '';
    };
  }, [ioc]);

  return rtopsStatus == KbnCallStatus.pending ? (
    <EuiLoadingSpinner size="xl"/>
  ) : (
    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiDataGrid
          columns={datagrid_columns}
          rowCount={ioc.length}
          renderCellValue={renderCellValue}
          toolbarVisibility={toolbarVisibility}
          columnVisibility={{visibleColumns, setVisibleColumns}}
          aria-labelledby={'ioc-grid'}
          gridStyle={gridStyle}
        />
      </EuiFlexItem>
    </EuiFlexGroup>

  );
}
