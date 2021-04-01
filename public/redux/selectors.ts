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

import {RedELKState} from "../types";
import {createSelector} from 'reselect';
import {filter} from 'lodash';

export const getConfigState = (state: RedELKState) => state.config;
export const getRtopsState = (state: RedELKState) => state.rtops;
export const getIPListsState = (state: RedELKState) => state.iplists;

export const getCurrentRoute = createSelector(
  [getConfigState], (configState) => configState.currentRoute
)
export const getShowTopNav = createSelector(
  [getConfigState], (configState) => configState.showTopNav
)
export const getInitStatus = createSelector(
  [getConfigState], (configState) => configState.initStatus
)
export const getAppState = createSelector(
  [getConfigState], (configState) => configState.appState
)
export const getTopNavMenu = createSelector(
  [getConfigState], (configState) => configState.topNavMenu
)

export const getRtopsEsAnswer = createSelector(
  [getRtopsState],
  (rtopsState) => rtopsState.rtops
)
export const getRtopsHits = createSelector(
  [getRtopsEsAnswer], (rtopsEsAnswer) => rtopsEsAnswer?.hits.hits || []
)
export const getRtopsAggs = createSelector(
  [getRtopsEsAnswer], (rtopsEsAnswer) => rtopsEsAnswer?.aggregations || {}
)
export const getRtopsStatus = createSelector(
  [getRtopsState], (rtopsState) => rtopsState.status
)
export const getRtopsShowAddIOCForm = createSelector(
  [getRtopsState], (rtopsState) => rtopsState.showAddIOCForm
)
export const getRtopsFilteredIOC = createSelector(
  [getRtopsHits],
  (rtops) => filter(rtops, r => r._source?.c2?.log?.type === 'ioc')
)
export const getRtopsLastRefreshDate = createSelector(
  [getRtopsState], (rtopsState) => rtopsState.lastRefresh
)

export const getIPListsEsAnswer = createSelector(
  [getIPListsState],
  (iplistsState) => iplistsState.iplists
)
export const getIPListsHits = createSelector(
  [getIPListsEsAnswer], (iplistsEsAnswer) => iplistsEsAnswer?.hits.hits || []
)
export const getIPListsAggs = createSelector(
  [getIPListsEsAnswer], (iplistsEsAnswer) => iplistsEsAnswer?.aggregations || {}
)
export const getIPListsStatus = createSelector(
  [getIPListsState], (iplistsState) => iplistsState.status
)
export const getIPListsShowAddIPForm = createSelector(
  [getIPListsState], (iplistsState) => iplistsState.showAddIPForm
)
export const getIPListsShowManageIPLists = createSelector(
  [getIPListsState], (iplistsState) => iplistsState.showManageIPLists
)
export const getIPListsLastRefreshDate = createSelector(
  [getIPListsState], (iplistsState) => iplistsState.lastRefresh
)
