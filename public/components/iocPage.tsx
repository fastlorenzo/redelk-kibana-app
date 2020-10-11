import React, {useEffect, useState} from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart, TopNavMenuData} from '../../../../src/plugins/navigation/public';
import {IOCTable} from "../features/ioc/iocTable";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiSpacer,
  EuiText,
  EuiTitle
} from '@elastic/eui';
import IOCSlice, {fetchAllIOC} from "../features/ioc/iocSlice";
import {AddIOCForm} from "../features/ioc/addIocForm";
import {useDispatch} from 'react-redux';
import {DataPublicPluginStart, IEsSearchRequest, IndexPattern, Query, TimeRange} from 'src/plugins/data/public';


interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
};


interface SearchArgs {
  query?: Query;
  dateRange: TimeRange;
}

export const IOCPage = ({basename, notifications, http, navigation, data}: RedelkAppDeps) => {
  const dispatch = useDispatch();

  const [isAddIOCFlyoutVisible, setIsAddIOCFlyoutVisible] = useState(false);
  const [indexPatterns, setIndexPatterns] = useState<IndexPattern[]>();
  const [searchQuery, setSearchQuery] = useState<Query>({query: "", language: "kuery"});
  const [searchDateRange, setSearchDateRange] = useState<TimeRange>({from: 'now-1y', to: 'now'});

  let addIOCFlyout;
  if (isAddIOCFlyoutVisible) {
    addIOCFlyout = (
      <EuiFlyout
        size="m"
        onClose={() => setIsAddIOCFlyoutVisible(false)}
        aria-labelledby="flyoutTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutTitle">Add an IOC</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <AddIOCForm http={http} callback={() => setIsAddIOCFlyoutVisible(false)}/>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }
  const handleRefresh = () => {
    console.log('refresh')
    dispatch(fetchAllIOC({http}))
  }

  useEffect(() => {
    data.indexPatterns.get('rtops').then(res => {
      console.log('Setting index patterns');
      setIndexPatterns([res]);
    })
  }, []);


  const handleQuerySubmit = ({query, dateRange}: SearchArgs, isUpdate: boolean | undefined) => {
    console.log('submit', query, dateRange, isUpdate);
    let qr: IEsSearchRequest = {
      params: {
        index: "rtops-*",
        q: "event.type: \"ioc\"",
        size: 500,
        sort: "@timestamp"
      }
    }
    const ss = data.search.searchSource.createEmpty();

    console.log(ss);
    data.search.search(qr).toPromise().then((res) => {
      console.log(res);
      dispatch(IOCSlice.actions.setIOC(res.rawResponse))
    });
  }
  const handleQueryChange = (payload: SearchArgs) => {
    const {query, dateRange} = payload;
    console.log('change', query, dateRange);
    setSearchQuery(query || {query: "", language: "kuery"});
    setSearchDateRange(dateRange);
  }

  const navConfig: TopNavMenuData[] = [
    {
      id: 'refresh-ioc',
      label: 'Refresh',
      run: () => {
        dispatch(fetchAllIOC({http}));
      },
      tooltip: () => {
        return 'Refresh the IOC list';
      }
    }, {
      id: 'add-ioc',
      label: 'Add IOC',
      run: () => {
        setIsAddIOCFlyoutVisible(true);
      }
    }
  ];
  const topNavMenu = '';

  return (
    <>
      {topNavMenu}
      <EuiPage>
        {addIOCFlyout}
        <EuiPageBody>

          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h2>IOC manual ingestion</h2>
              </EuiTitle>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiText>
                <p>In this page you can manually ingest IOC in RedELK.</p>
              </EuiText>
              <EuiSpacer/>

              <IOCTable http={http}/>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  )
};
