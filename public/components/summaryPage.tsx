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

import React from 'react';
import { CoreStart } from 'kibana/public';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingSpinner,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  euiPaletteColorBlind,
  EuiStat,
  EuiTitle,
} from '@elastic/eui';
import { useSelector } from 'react-redux';
import { Axis, BarSeries, Chart, Partition, Settings } from '@elastic/charts';
import { EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import { KbnCallStatus } from '../types';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { useTopNav } from '../helpers/nav_header_helper';
import { getRtopsAggs, getRtopsStatus } from '../redux/selectors';
import { useKibana } from '../../../../src/plugins/kibana_react/public';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const SummaryPage = ({ basename, notifications, http, navigation }: RedelkAppDeps) => {
  const rtopsStatus = useSelector(getRtopsStatus);
  const rtopsAggs = useSelector(getRtopsAggs);
  const kibana = useKibana();
  const isDarkMode = kibana.services.uiSettings?.get('theme:darkMode') && true;

  useTopNav(true);
  let perEventTypeChart = <h4>No data</h4>;
  let perHostNameChart = <h4>No data</h4>;
  if (rtopsAggs.perEventType && rtopsAggs.perHostName && rtopsAggs.perUserName) {
    const perEventTypeData = rtopsAggs.perEventType.buckets;
    const perHostNameData = rtopsAggs.perHostName.buckets;
    perEventTypeChart =
      rtopsStatus !== KbnCallStatus.pending ? (
        <Chart size={{ height: 300 }}>
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
            color={euiPaletteColorBlind({ rotations: 2, order: 'group' }).slice(1, 20)}
          />
          <Axis id="bottom-axis" position={'left'} />
          <Axis id="left-axis" showGridLines position={'bottom'} />
        </Chart>
      ) : (
        <EuiLoadingSpinner size="xl" />
      );
    perHostNameChart =
      rtopsStatus !== KbnCallStatus.pending ? (
        <Chart size={{ height: 300 }}>
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
                groupByRollup: (d: { key: string; sortIndex: number }) => d.key,
                shape: {
                  fillColor: (d) => euiPaletteColorBlind().slice(d.sortIndex, d.sortIndex + 1)[0],
                },
              },
            ]}
            config={{
              emptySizeRatio: 0.4,
              clockwiseSectors: false,
            }}
          />
        </Chart>
      ) : (
        <EuiLoadingSpinner size="xl" />
      );
  }

  const totalHosts = rtopsAggs?.perHostName?.buckets?.length || 0;
  const totalUsers = rtopsAggs?.perUserName?.buckets?.length || 0;
  const totalIOC =
    rtopsAggs?.perEventType?.buckets?.filter((v) => v.key === 'ioc')[0]?.doc_count || 0;
  const totalDownloads =
    rtopsAggs?.perEventType?.buckets?.filter((v) => v.key === 'downloads')[0]?.doc_count || 0;
  const totalImplants = rtopsAggs?.perImplant?.buckets?.length || 0;

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageContent>
          <EuiFlexGroup>
            {/* Alarms */}
            <EuiFlexItem>
              <EuiStat
                title="--"
                description={
                  <>
                    <EuiIcon type="alert" /> Alarms
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>

            {/* Implants */}
            <EuiFlexItem>
              <EuiStat
                title={totalImplants}
                description={
                  <>
                    <EuiIcon type="bug" /> Implants
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>

            {/* IOC */}
            <EuiFlexItem>
              <EuiStat
                title={totalIOC}
                description={
                  <>
                    <EuiIcon type="securitySignal" /> IOC
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>

            {/* Downloads */}
            <EuiFlexItem>
              <EuiStat
                title={totalDownloads}
                description={
                  <>
                    <EuiIcon type="download" /> Downloads
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>

            {/* Hosts */}
            <EuiFlexItem>
              <EuiStat
                title={totalHosts}
                description={
                  <>
                    <EuiIcon type="grid" /> Hosts
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>

            {/* Users */}
            <EuiFlexItem>
              <EuiStat
                title={totalUsers}
                description={
                  <>
                    <EuiIcon type="users" /> Users
                  </>
                }
                textAlign="left"
                reverse
                isLoading={rtopsStatus === KbnCallStatus.pending}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiTitle size="s">
                <p>Event type</p>
              </EuiTitle>
              {perEventTypeChart}
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiTitle size="s">
                <p>Hostnames</p>
              </EuiTitle>
              {perHostNameChart}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
