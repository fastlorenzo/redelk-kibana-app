import React from 'react';
import {CoreStart} from "kibana/public";
import {NavigationPublicPluginStart} from '../../../../src/plugins/navigation/public';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiKeyPadMenuItem,
  EuiLoadingSpinner,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  euiPaletteColorBlind,
  EuiStat,
  EuiTitle
} from '@elastic/eui';
import {KbnCallStatus} from "../types";
import {useSelector} from 'react-redux';
import {Axis, BarSeries, Chart, Partition, Settings} from '@elastic/charts';
import {EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT} from '@elastic/eui/dist/eui_charts_theme';
import {useTopNav} from "../navHeaderHelper";
import {getRtopsAggs, getRtopsStatus} from "../selectors";
import {useKibana} from '../../../../src/plugins/kibana_react/public';

interface RedelkAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const SummaryPage = ({basename, notifications, http, navigation}: RedelkAppDeps) => {

  //const rtops = useSelector(getRtopsHits);
  const rtopsStatus = useSelector(getRtopsStatus);
  const rtopsAggs = useSelector(getRtopsAggs);
  const kibana = useKibana();
  const isDarkMode = kibana.services.uiSettings?.get("theme:darkMode") && true;
  console.log(kibana);
  // const [dashboardDef, setDashboardDef] = useState<SimpleSavedObject<SavedObjectDashboard>>();
  useTopNav(true);
  let perEventTypeChart = (<h4>No data</h4>);
  let perHostNameChart = (<h4>No data</h4>);
  if (rtopsAggs.perEventType && rtopsAggs.perHostName && rtopsAggs.perUserName) {
    const perEventTypeData = rtopsAggs.perEventType.buckets;
    const perHostNameData = rtopsAggs.perHostName.buckets;
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

  const totalHosts = rtopsAggs?.perHostName?.buckets?.length || 0;
  const totalUsers = rtopsAggs?.perUserName?.buckets?.length || 0;
  const totalIOC = rtopsAggs?.perEventType?.buckets?.filter(v => v.key === "ioc")[0]?.doc_count || 0;
  const totalDownloads = rtopsAggs?.perEventType?.buckets?.filter(v => v.key === "downloads")[0]?.doc_count || 0;
  const totalImplants = rtopsAggs?.perImplant?.buckets?.length || 0;


  return (
    <EuiPage>
      <EuiPageBody>
        <EuiPageContent>
          <EuiFlexGroup>

            {/* Alarms */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="Alarms"
                betaBadgeTooltipContent="Go to Alarms dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/53b69200-d4e3-11ea-9301-a30a04251ae9"})}
              >
                <EuiStat
                  title="--"
                  description={(<><EuiIcon type="alert"/> Alarms</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
            </EuiFlexItem>

            {/* Implants */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="Implants"
                betaBadgeTooltipContent="Go to Implants dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/117dbba0-c6f5-11e8-a9c6-cd307b96b1ba"})}
              >
                <EuiStat
                  title={totalImplants}
                  description={(<><EuiIcon type="bug"/> Implants</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
            </EuiFlexItem>

            {/* IOC */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="IOC"
                betaBadgeTooltipContent="Go to IOC dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/86643e90-d4e4-11ea-9301-a30a04251ae9"})}
              >
                <EuiStat
                  title={totalIOC}
                  description={(<><EuiIcon type="securitySignal"/> IOC</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
            </EuiFlexItem>

            {/* Downloads */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="Downloads"
                betaBadgeTooltipContent="Go to Downloads dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/643de010-d04c-11ea-9301-a30a04251ae9"})}
              >
                <EuiStat
                  title={totalDownloads}
                  description={(<><EuiIcon type="download"/> Downloads</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
            </EuiFlexItem>

            {/* Hosts */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="Red Team Operations"
                betaBadgeTooltipContent="Go to Red Team Operations dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/04b87c50-d028-11ea-9301-a30a04251ae9"})}
              >
                <EuiStat
                  title={totalHosts}
                  description={(<><EuiIcon type="grid"/> Hosts</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
            </EuiFlexItem>

            {/* Users */}
            <EuiFlexItem>
              <EuiKeyPadMenuItem
                label=""
                className="redelk-stat-menu-item"
                betaBadgeLabel="Red Team Operations"
                betaBadgeTooltipContent="Go to Red Team Operations dashboard."
                betaBadgeIconType="popout"
                onClick={() => kibana.services.application?.navigateToApp('dashboards', {path: "#/view/04b87c50-d028-11ea-9301-a30a04251ae9"})}
              >
                <EuiStat
                  title={totalUsers}
                  description={(<><EuiIcon type="users"/> Users</>)}
                  textAlign="left"
                  reverse
                  isLoading={rtopsStatus === KbnCallStatus.pending}
                />
              </EuiKeyPadMenuItem>
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
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
