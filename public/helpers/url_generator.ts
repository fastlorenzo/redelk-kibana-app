import {setStateToKbnUrl} from '../../../../src/plugins/kibana_utils/public';
import {esFilters, Filter, Query, QueryState, RefreshInterval, TimeRange} from '../../../../src/plugins/data/public';

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

  constructor(private readonly params: Params) {
  }

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
    url = setStateToKbnUrl<QueryState>('_g', queryState, {useHash}, url);
    url = setStateToKbnUrl('_a', appState, {useHash}, url);

    return url;
  };


}
