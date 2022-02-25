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

import { setStateToKbnUrl } from '../../../../src/plugins/kibana_utils/public';
import {
  esFilters,
  Filter,
  Query,
  QueryState,
  RefreshInterval,
  TimeRange,
} from '../../../../src/plugins/data/public';

export const REDELK_APP_URL_GENERATOR = 'REDELK_APP_URL_GENERATOR';

export interface RedelkUrlGeneratorState {
  /**
   * Optionally set saved search ID.
   */
  savedSearchId?: string;

  /**
   * Optionally set index pattern ID.
   */
  indexPatternId?: string;

  /**
   * Optionally set the time range in the time picker.
   */
  time?: TimeRange;

  /**
   * Optionally set the refresh interval.
   */
  refreshInterval?: RefreshInterval;

  /**
   * Optionally apply filers.
   */
  filters?: Filter[];

  /**
   * Optionally set a query. NOTE: if given and used in conjunction with `dashboardId`, and the
   * saved dashboard has a query saved with it, this will _replace_ that query.
   */
  query?: Query;

  /**
   * If not given, will use the uiSettings configuration for `storeInSessionStorage`. useHash determines
   * whether to hash the data in the url to avoid url length issues.
   */
  useHash?: boolean;
}

interface Params {
  appBasePath: string;
  useHash: boolean;
}

export class RedelkURLGenerator {
  public readonly id = REDELK_APP_URL_GENERATOR;

  constructor(private readonly params: Params) {}

  public readonly createUrl = ({
    filters,
    indexPatternId,
    query,
    refreshInterval,
    savedSearchId,
    time,
    useHash = this.params.useHash,
  }: RedelkUrlGeneratorState): string => {
    const savedSearchPath = savedSearchId ? encodeURIComponent(savedSearchId) : '';
    const appState: {
      query?: Query;
      filters?: Filter[];
      time?: TimeRange;
      index?: string;
    } = {};
    const queryState: QueryState = {};

    if (query) appState.query = query;
    if (filters && filters.length)
      appState.filters = filters?.filter((f) => !esFilters.isFilterPinned(f));
    if (indexPatternId) appState.index = indexPatternId;

    if (time) {
      queryState.time = time;
      appState.time = time;
    }
    if (filters && filters.length)
      queryState.filters = filters?.filter((f) => esFilters.isFilterPinned(f));
    if (refreshInterval) queryState.refreshInterval = refreshInterval;

    let url = `${this.params.appBasePath}#/${savedSearchPath}`;
    url = setStateToKbnUrl<QueryState>('_g', queryState, { useHash }, url);
    url = setStateToKbnUrl('_a', appState, { useHash }, url);

    return url;
  };
}
