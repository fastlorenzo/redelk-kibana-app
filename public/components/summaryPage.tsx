import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingSpinner,
  euiPaletteColorBlind,
  EuiStat,
  EuiTitle
} from '@elastic/eui';
import {EsAnswerRtops, KbnCallStatus, RedELKState} from "../types";
import {useSelector} from 'react-redux';
import {Axis, BarSeries, Chart, Partition, Settings} from '@elastic/charts';
import {EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT} from '@elastic/eui/dist/eui_charts_theme';
import {useTopNav} from "../navHeaderHelper";

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const SummaryPage = ({basename, notifications, http, navigation}: RedelkAppDeps) => {
  const ioc: (EsAnswerRtops | undefined) = useSelector((state: RedELKState) => state.rtops.rtops);
  const rtopsStatus = useSelector((state: RedELKState) => state.rtops.status);

  // const [dashboardDef, setDashboardDef] = useState<SimpleSavedObject<SavedObjectDashboard>>();
  useTopNav(true);
  let perEventTypeChart = (<h4>No data</h4>);
  let perHostNameChart = (<h4>No data</h4>);
  if (ioc?.aggregations?.perEventType && ioc?.aggregations?.perHostName && ioc?.aggregations?.perUserName) {
    const perEventTypeData = ioc.aggregations.perEventType.buckets;
    const perHostNameData = ioc.aggregations.perHostName.buckets;
    const isDarkMode = true;
    perEventTypeChart = (rtopsStatus !== KbnCallStatus.pending) ?
      (
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
      ) : (<EuiLoadingSpinner size="xl"/>)
    perHostNameChart = (rtopsStatus !== KbnCallStatus.pending) ?
      (
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
      ) : (<EuiLoadingSpinner size="xl"/>);
  }
  // const VISUALIZATIONS = [
  //   {
  //     name: "hosts",
  //     id: "b19d4790-d35f-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "credentials",
  //     id: "dcf86190-d319-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "downloads",
  //     id: "b5beb3c0-d04b-11ea-9301-a30a04251ae9"
  //   }, {
  //     name: "screenshots",
  //     id: "389dddc0-d317-11ea-9301-a30a04251ae9"
  //   }
  // ]
  // console.log(kibana.services.visualizations.get("metric"));
  // useEffect(() => {
  //   const embFact: EmbeddableFactory = kibana.services.embeddable.getEmbeddableFactory("visualization");
  //   VISUALIZATIONS.forEach(viz => {
  //     embFact.createFromSavedObject(viz.id, {
  //       id: viz.id + '-' + viz.name,
  //       viewMode: ViewMode.VIEW,
  //       lastReloadRequestTime: 0
  //     }).then(res => {
  //       console.log("embed", res);
  //       const vizEmb = res as VisualizeEmbeddable;
  //       const elem = window.document.getElementById("summary-embedded-viz-" + viz.name);
  //       if (elem) {
  //         elem.innerHTML = "";
  //         console.log('Rendering viz: ' + viz.name);
  //         vizEmb.render(elem);
  //       }
  //     })
  //   })
  // }, [ioc]);

  // console.log('dashboardDef', dashboardDef);
  // let dashboard = (<p>Loading dashboard</p>);
  // if(dashboardDef !== undefined) {
  //   const dashboardOptions = JSON.parse(dashboardDef.attributes.optionsJSON || "") as {useMargins:boolean, hidePanelTitles: boolean};
  //   const dashboardConfig: DashboardContainerInput = {
  //     viewMode: ViewMode.VIEW,
  //     panels: JSON.parse(dashboardDef.attributes.panelsJSON) as {
  //       [panelId: string]: DashboardPanelState<EmbeddableInput & { [k: string]: unknown }>;
  //     },
  //     filters: [],
  //     title: dashboardDef.attributes.title,
  //     useMargins: dashboardOptions.useMargins,
  //     query: {
  //       language: "kuery",
  //       query: ""
  //     },
  //     timeRange: {
  //       from: dashboardDef.attributes.timeFrom || "",
  //       to: dashboardDef.attributes.timeTo || ""
  //     },
  //     isFullScreenMode: false,
  //     id: dashboardDef.id
  //   }
  //   console.log(dashboardConfig);
  //   dashboard = (
  //     <kibana.services.dashboard.DashboardContainerByValueRenderer input={dashboardConfig}/>
  //   );
  // }

  // useEffect(() => {
  //   kibana.services.savedObjects?.client.get("dashboard","02486040-d355-11ea-9301-a30a04251ae9").then(res => {
  //     console.log("found dashboard", res);
  //     setDashboardDef(res);
  //   })
  // }, [])

  // const embeddedViz = (
  //   <EuiFlexGroup>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-hosts"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-credentials"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-downloads"></div>
  //     </EuiFlexItem>
  //     <EuiFlexItem>
  //       <div className="summary-embedded-viz" id="summary-embedded-viz-screenshots"></div>
  //     </EuiFlexItem>
  //   </EuiFlexGroup>
  // );

  const totalHosts = ioc?.aggregations?.perHostName?.buckets?.length || 0;
  const totalUsers = ioc?.aggregations?.perUserName?.buckets?.length || 0;
  const totalIOC = ioc?.aggregations?.perEventType?.buckets?.filter(v => v.key === "ioc")[0]?.doc_count || 0;
  const totalDownloads = ioc?.aggregations?.perEventType?.buckets?.filter(v => v.key === "downloads")[0]?.doc_count || 0;
  const totalImplants = ioc?.aggregations?.perImplant?.buckets?.length || 0;

  return (
    <>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiStat
            title={totalHosts}
            description={(<><EuiIcon type="grid"/> Unique hosts</>)}
            textAlign="left"
            isLoading={rtopsStatus === KbnCallStatus.pending}
          >
          </EuiStat>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={totalUsers}
            description={(<><EuiIcon type="users"/> Unique users</>)}
            textAlign="left"
            isLoading={rtopsStatus === KbnCallStatus.pending}
          >
          </EuiStat>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={totalIOC}
            description={(<><EuiIcon type="securitySignal"/> IOC</>)}
            textAlign="left"
            isLoading={rtopsStatus === KbnCallStatus.pending}
          >
          </EuiStat>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={totalDownloads}
            description={(<><EuiIcon type="download"/> Downloads</>)}
            textAlign="left"
            isLoading={rtopsStatus === KbnCallStatus.pending}
          >
          </EuiStat>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={totalImplants}
            description={(<><EuiIcon type="bug"/> Unique implants</>)}
            textAlign="left"
            isLoading={rtopsStatus === KbnCallStatus.pending}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
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
    </>
  );
};
