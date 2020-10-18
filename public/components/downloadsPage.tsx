import React from 'react';
import {useTopNav} from "../helpers/nav_header_helper";
import {EmbeddedDashboard} from "./embeddedDashboard";

export const DownloadsPage = () => {

  useTopNav(true);

  return (
    <>
      <EmbeddedDashboard dashboardId="643de010-d04c-11ea-9301-a30a04251ae9"/>
    </>
  );
};
