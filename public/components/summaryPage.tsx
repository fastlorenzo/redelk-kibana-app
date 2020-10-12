import React, {useEffect} from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  euiPaletteColorBlind,
  EuiTitle
} from '@elastic/eui';
import {EsAnswerRtops, RedELKState} from "../types";
import {useSelector} from 'react-redux';
import {Axis, BarSeries, Chart, Partition, Settings} from '@elastic/charts';
import {EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT} from '@elastic/eui/dist/eui_charts_theme';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  showTopNav: (arg0: boolean) => void;
}

export const SummaryPage = ({basename, notifications, http, navigation, showTopNav}: RedelkAppDeps) => {
  const ioc: (EsAnswerRtops | undefined) = useSelector((state: RedELKState) => state.rtops.rtops);

  useEffect(() => showTopNav(true), []);
  let perEventTypeChart = (<h4>No data</h4>);
  let perHostNameChart = (<h4>No data</h4>);
  if (ioc?.aggregations?.perEventType && ioc?.aggregations?.perHostName && ioc?.aggregations?.perUserName) {
    const perEventTypeData: [] = ioc.aggregations.perEventType.buckets;
    const perHostNameData: [] = ioc.aggregations.perHostName.buckets;
    const isDarkMode = true;
    perEventTypeChart = (
      <Chart size={{height: 300}}>
        <Settings
          theme={isDarkMode ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme}
          rotation={90}
          showLegend={false}
          legendPosition="right"
        />
        <BarSeries
          id="perEventType"
          name="Event type"
          data={perEventTypeData}
          xAccessor="key"
          yAccessors={['doc_count']}
          color={euiPaletteColorBlind({rotations: 2, order: 'group'}).slice(1, 20)}
        />
        <Axis
          id="bottom-axis"
          position={'left'}
        />
        <Axis
          id="left-axis"
          showGridLines
          position={'bottom'}
        />
      </Chart>
    )
    perHostNameChart = (
      <Chart size={{height: 300}}>
        <Settings
          theme={isDarkMode ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme}
          showLegend={true}
          legendPosition="right"
        />
        <Partition
          id="perHostName"
          data={perHostNameData}
          valueAccessor={(d) => Number(d.doc_count)}
          layers={[
            {
              groupByRollup: (d: { key: string, sortIndex: number }) => d.key,
              shape: {
                fillColor: d =>
                  euiPaletteColorBlind().slice(d.sortIndex, d.sortIndex + 1)[0],
              },
            },
          ]}
          config={{
            emptySizeRatio: 0.4,
            clockwiseSectors: false,
          }}
        />

      </Chart>
    )
  }

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageHeader>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiTitle size="s"><p>Event type</p></EuiTitle>
              {perEventTypeChart}
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiTitle size="s"><p>Hostnames</p></EuiTitle>
              {perHostNameChart}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
