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

import { CoreStart } from 'kibana/public';
import { ActionType, CreateIPType, DeleteIPType } from '../types';
import { KbnCallStatus } from '../../types';
import { DataPublicPluginStart, IEsSearchRequest } from '../../../../../src/plugins/data/public';

interface ActionArgs<T> {
  http: CoreStart['http'];
  payload?: T;
}

export const fetchAllIPLists = (payload: {
  data: DataPublicPluginStart;
  searchOpts: IEsSearchRequest;
}) => {
  return {
    type: ActionType.IPLISTS_FETCH_ALL_REQUEST,
    payload,
  };
};

export const createIP = (payload: ActionArgs<CreateIPType>) => {
  return {
    type: ActionType.IPLISTS_CREATE_IP_REQUEST,
    payload,
  };
};

export const deleteIPs = (payload: ActionArgs<DeleteIPType[]>) => {
  return {
    type: ActionType.IPLISTS_DELETE_IPS_REQUEST,
    payload,
  };
};

export const setIPListsStatus = (payload: KbnCallStatus) => {
  return {
    type: ActionType.IPLISTS_SET_STATUS,
    payload,
  };
};

export const setShowAddIPForm = (payload: boolean) => {
  return {
    type: ActionType.IPLISTS_SHOW_ADD_IP_FORM,
    payload,
  };
};

export const setShowManageIPLists = (payload: boolean) => {
  return {
    type: ActionType.IPLISTS_SHOW_MANAGE_IPLISTS,
    payload,
  };
};
