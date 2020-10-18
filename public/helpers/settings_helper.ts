import {CoreStart} from "kibana/public";

export const initSettings = async (core: CoreStart) => {
  const defaultRoute = await core.uiSettings.get("defaultRoute");
  if (defaultRoute !== "/app/redelk/") {
    await core.uiSettings.set("theme:darkMode", true);
    await core.uiSettings.set("telemetry:optIn", false);
    await core.uiSettings.set("telemetry:enabled", false);
    await core.uiSettings.set("shortDots:enabled", true);
    await core.uiSettings.set("siem:enableNewsFeed", false);
    await core.uiSettings.set("siem:defaultIndex", ["apm-*-transaction*", "auditbeat-*", "endgame-*", "filebeat-*", "packetbeat-*", "winlogbeat-*", "rtops-*", "redirtraffic-*"]);
    await core.uiSettings.set("defaultIndex", "195a3f00-d04f-11ea-9301-a30a04251ae9");
    await core.uiSettings.set("defaultRoute", "/app/redelk/");
    window.location.reload();
  }
}
