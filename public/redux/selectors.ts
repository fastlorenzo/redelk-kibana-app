import {RedELKState} from "../types";
import {createSelector} from 'reselect';
import {filter} from 'lodash';

export const getConfigState = (state: RedELKState) => state.config;
export const getRtopsState = (state: RedELKState) => state.rtops;

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

