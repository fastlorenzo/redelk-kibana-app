import React from 'react';
import {useTopNav} from "../helpers/nav_header_helper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const RtopsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="04b87c50-d028-11ea-9301-a30a04251ae9"/>
    </>
  );
};
