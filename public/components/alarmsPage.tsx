import React from 'react';
import {useTopNav} from "../helpers/nav_header_helper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const AlarmsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="53b69200-d4e3-11ea-9301-a30a04251ae9"/>
    </>
  );
};
