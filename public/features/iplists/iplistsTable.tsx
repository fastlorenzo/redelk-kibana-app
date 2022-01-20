/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) Lorenzo Bernardi
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

import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EuiBasicTable,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiSpacer,
} from '@elastic/eui';

import { CoreStart } from 'kibana/public';
import { EsAnswer, IPListsDoc, KbnCallStatus } from '../../types';
import { getIPListsHits, getIPListsStatus } from '../../redux/selectors';
import { ActionCreators } from '../../redux/rootActions';

interface IPListsTableDeps {
  http: CoreStart['http'];
}

export const IplistsTable = ({ http }: IPListsTableDeps) => {
  const dispatch = useDispatch();

  const iplistsHits = useSelector(getIPListsHits);
  const iplistsStatus = useSelector(getIPListsStatus);
  // const iplistsTableData = useSelector(getIPListsTable);

  const [selectedItems, setSelectedItems] = useState<Array<EsAnswer<IPListsDoc>>>([]);

  const onSelectionChange = (selectedItemsArg: Array<EsAnswer<IPListsDoc>>) => {
    setSelectedItems(selectedItemsArg);
  };

  const onClickDelete = () => {
    console.log('Deleting selected items', selectedItems);
    const payload = selectedItems.map((item) => ({ id: item._id, index: item._index }));
    dispatch(ActionCreators.deleteIPs({ http, payload }));
    setSelectedItems([]);
  };

  const tableColumns = [
    {
      field: '_source.@timestamp',
      name: 'Time added/updated',
      sortable: true,
    },
    {
      field: '_index',
      name: 'Index',
      sortable: true,
    },
    {
      field: '_source.iplist.name',
      name: 'List',
      sortable: true,
    },
    {
      field: '_source.iplist.ip',
      name: 'IP',
      sortable: true,
    },
    {
      field: '_source.iplist.source',
      name: 'Source',
      sortable: true,
    },
  ];

  const selection = {
    selectable: (select: EsAnswer<IPListsDoc>) => select._source.iplist.source !== 'config_file',
    selectableMessage: (selectable: boolean) =>
      !selectable ? 'IPs configured in config files cannot be deleted from here' : '',
    onSelectionChange,
  };

  const addButton = (
    <EuiButton
      iconType="plusInCircle"
      onClick={() => dispatch(ActionCreators.setShowAddIPForm(true))}
    >
      Add IP
    </EuiButton>
  );
  const renderDeleteButton = () => {
    if (selectedItems.length === 0) {
      return;
    }

    return (
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} IPs
      </EuiButton>
    );
  };
  const deleteButton = renderDeleteButton();

  return iplistsStatus === KbnCallStatus.pending ? (
    <EuiLoadingSpinner size="xl" />
  ) : (
    <Fragment>
      <EuiFlexGroup gutterSize="s" alignItems="center">
        <EuiFlexItem grow={false}>{addButton}</EuiFlexItem>
        <EuiFlexItem grow={false}>{deleteButton}</EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiBasicTable
        items={iplistsHits}
        itemId="_id"
        columns={tableColumns}
        isSelectable={true}
        selection={selection}
      />
    </Fragment>
  );
};
